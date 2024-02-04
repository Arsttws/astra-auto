import { Link } from "react-router-dom";

import styles from '../styles/modules/postCard.module.scss'

export default function PostCard({ post }: any) {
  return (
    <div className={styles.post}>
        <Link to={`/post/${post.slug}`}>
          <div className={styles.imgContainer}>
            <img src={post.image} alt="post image" />
          </div>
        </Link>
        <div className={styles.postInfo}>
            <div className={styles.titleLink}>
                <Link to={`/post/${post.slug}`} className={styles.title}>{post.title}</Link>
            </div>
            <div className={styles.action}>
                <div className={styles.addInfo}>
                  <p className={styles.category}>{post.category}</p>
                  <p>{new Date(post.updatedAt).toLocaleDateString()}</p>
                </div>
        <Link to={`/post/${post.slug}`} className={styles.read}>
            Читать
        </Link>

            </div>
        </div>
    </div>
  )
}
