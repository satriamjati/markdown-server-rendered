import "@/styles/markdown.css";
import styles from "./page.module.css";
const productsById = require('@/data/products-by-id.json');

export default function ProductPage({ id }) {
  const product = productsById[id];
  return (
      <div className={styles.productDetail}>
        <div dangerouslySetInnerHTML={{ __html: product.descriptionHtml }} />
      </div>
  );
}

