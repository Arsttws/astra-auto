import { BrowserRouter, Routes, Route } from "react-router-dom";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import Header from "./Components/Layout/Header";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import Footer from "./Components/Layout/Footer";
import PrivateRoute from "./Components/PrivateRoute";
import PrivateRouteAdmin from "./Components/PrivateRouteAdmin";
import NewPost from "./pages/NewPost";
import UpdatePost from "./pages/UpdatePost";
import Post from "./pages/Post";
import ScrollToTop from "./Components/ScrollToTop";
import Search from "./pages/Search";
import NewCar from "./Components/NewCar";

const App = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Header />
      <Routes>
        {/* public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/post/:postSlug" element={<Post />} />
        <Route path="/search" element={<Search />} />

        {/* private routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/add-car" element={<NewCar />} />
        </Route>

        {/* admin routes */}
        <Route element={<PrivateRouteAdmin />}>
          <Route path="/new-post" element={<NewPost />} />
          <Route path="/update-post/:postId" element={<UpdatePost />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
};

export default App;
