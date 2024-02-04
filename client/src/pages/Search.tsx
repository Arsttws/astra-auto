import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PostCard from "../Components/PostCard";

import styles from "../styles/modules/search.module.scss";

export default function Search() {
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarData, setSidebarData] = useState<any>({
    searchTerm: "",
    sort: "desc",
    category: "",
  });

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get("searchTerm");
    const sortFromUrl = urlParams.get("sort");
    const categoryFromUrl = urlParams.get("category");
    if (searchTermFromUrl || sortFromUrl || categoryFromUrl) {
      setSidebarData({
        ...sidebarData,
        searchTerm: searchTermFromUrl,
        sort: sortFromUrl,
        category: categoryFromUrl,
      });
    }

    const fetchPosts = async () => {
      setLoading(true);
      const searchQuery = urlParams.toString();
      const res = await fetch(`/api/post/getposts?${searchQuery}`);
      if (!res.ok) {
        setLoading(false);
        return;
      }
      if (res.ok) {
        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        if (data.posts.length === 12) {
          setShowMore(true);
        } else {
          setShowMore(false);
        }
      }
    };
    fetchPosts();
  }, [location.search]);

  const handleChange = (e: any) => {
    if (e.target.id === "searchTerm") {
      setSidebarData({ ...sidebarData, searchTerm: e.target.value });
    }
    if (e.target.id === "sort") {
      const order = e.target.value || "asc";
      setSidebarData({ ...sidebarData, sort: order });
    }
    if (e.target.id === "category") {
      const category = e.target.value || "";
      setSidebarData({ ...sidebarData, category });
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("searchTerm", sidebarData.searchTerm);
    urlParams.set("sort", sidebarData.sort);
    urlParams.set("category", sidebarData.category);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  const handleShowMore = async () => {
    const numberOfPosts = posts.length;
    const startIndex = numberOfPosts;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set("startIndex", startIndex.toString());
    const searchQuery = urlParams.toString();
    const res = await fetch(`/api/post/getposts?${searchQuery}`);
    if (!res.ok) {
      return;
    }
    if (res.ok) {
      const data = await res.json();
      setPosts([...posts, ...data.posts]);
      if (data.posts.length === 12) {
        setShowMore(true);
      } else {
        setShowMore(false);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h2>Искать</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Поиск</label>
            <input
              type="text"
              placeholder="Искать..."
              id="searchTerm"
              value={sidebarData.searchTerm}
              onChange={handleChange}
            />
          </div>
          {/* <div>
            <label>Сортировать</label>
            <select onChange={handleChange} value={sidebarData.sort} id="sort">
              <option value="desc">Новые</option>
              <option value="asc">Старые</option>
            </select>
          </div> */}
          <div>
            <label>Категория</label>
            <select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
            >
              <option value="">Все</option>
              <option value="Новости">Новости</option>
              <option value="Статьи">Статьи</option>
              <option value="Акции">Акции</option>
            </select>
          </div>
        </form>
        <button onClick={handleSubmit} className={styles.save}>
          Сохранить
        </button>
      </div>
      <div className={styles.right}>
        <h1>Результаты поиска:</h1>
        <div className={styles.posts}>
          {!loading && posts.length === 0 && <p>Поиск не дал результатов</p>}

          {loading && <p>Загрузка...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCard key={post._id} post={post} />)}
        </div>
        {showMore && (
          <button onClick={handleShowMore} className={styles.showMore}>
            Показать еще
          </button>
        )}
      </div>
    </div>
  );
}
