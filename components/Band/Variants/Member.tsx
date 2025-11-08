import Image from "next/image";
import { useState } from "react";
import { getOptimizedImage } from "../../../utils/common";
import { renderRichTextContent } from "../../../utils/RichText";
import { Heading, type HeadingProps } from "../../Headings";
import { Modal } from "../../Modal/Modal";
import styles from "./Member.module.scss";

interface ImageData {
  url?: string;
  alt?: string;
  [key: string]: any;
}

export interface MemberData {
  image: ImageData[];
  heading: {
    size?: HeadingProps["size"];
    as?: HeadingProps["as"];
    heading: string; // content from CMS
    [key: string]: any;
  };
  content?: any;
  role?: string;
  active?: boolean;
  [key: string]: any;
}

interface Labels {
  learnMore?: string;
}

interface MemberProps extends React.HTMLAttributes<HTMLDivElement> {
  data: MemberData;
  tabIndex: number;
  labels?: Labels;
}

export const Member = ({ data, tabIndex, labels, ...props }: MemberProps) => {
  const { image, heading, content, role } = data;
  const [modalOpen, setModalOpen] = useState(false);

  // Defensive check for image array
  const mainImage = image?.[0];
const { url, width, height } = getOptimizedImage(mainImage, 800, "100");


  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  return (
    <>
      <div className={styles.member} tabIndex={tabIndex + 1} {...props}>
        <figure className={styles.member__figure}>
          {url && (
            <Image
              src={url}
              alt={mainImage?.alt || ""}
              width={width}
              height={height}
              className={styles.member__image}
            />
          )}
          <figcaption>
            <div className={styles.member__content}>
              <Heading size={heading?.size} as={heading?.as} className={styles.member__name}>
                {heading?.heading}
              </Heading>
              {role && <span>{role}</span>}
            </div>
          </figcaption>
        </figure>
        <a onClick={handleOpenModal} className={styles.member__button}>
          <span className="sr-only">{labels?.learnMore}</span>
        </a>
      </div>

      <Modal isOpen={modalOpen} onClose={handleCloseModal}>
        <div className={styles.mleader}>
          {url && (
            <Image
              src={url}
              alt={mainImage?.alt || ""}
              width={width}
              height={height}
              className={styles.member__image}
            />
          )}
          <div>
            <Heading size="h1" as="div" className={styles.mleader__name}>
              {heading?.heading}
            </Heading>
            {content && <div className={styles.mleader__text}>{renderRichTextContent(content)}</div>}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Member;
