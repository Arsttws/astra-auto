import { Link } from "react-router-dom";

export default function PostCard({ post }: any) {
  return (
    <div>
        <Link to={`/post/${post.slug}`}>
            <img src={post.image} alt="post image" />
            <div>
                <p>{post.title}</p>
                <p>{post.category}</p>
            </div>
        </Link>
        <Link to={`/post/$${post.slug}`}>
            Читать
        </Link>
    </div>
  )
}
