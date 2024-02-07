import Post from "../models/post.model.js";
import UserPost from "../models/userPost.model.js";
import { errorHandler } from "../utils/error.js";

export const create = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "Вам не разрешено публиковать статьи"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Заполните все необходимые поля"));
  }

  function generate_url(str) {
    var url = str.replace(/[\s]+/gi, "-");
    url = translit(url);
    url = url.replace(/[^0-9a-z_\-]+/gi, "").toLowerCase();
    return url;
  }
  function translit(str) {
    var ru =
      "А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я".split(
        "-"
      );
    var en =
      "A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-YU-yu-YA-ya".split(
        "-"
      );
    var res = "";
    for (var i = 0, l = str.length; i < l; i++) {
      var s = str.charAt(i),
        n = ru.indexOf(s);
      if (n >= 0) {
        res += en[n];
      } else {
        res += s;
      }
    }
    return res;
  }
  const slug = generate_url(req.body.title);
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};

export const createUserPost = async (req, res, next) => {
  if (!req.user) {
    return next(errorHandler(403, "Вам не разрешено публиковать статьи"));
  }
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(400, "Заполните все необходимые поля"));
  }
  if (!req.body.image) {
    return next(errorHandler(400, "Добавьте картинку"));
  }

  function generate_url(str) {
    var url = str.replace(/[\s]+/gi, "-");
    url = translit(url);
    url = url.replace(/[^0-9a-z_\-]+/gi, "").toLowerCase();
    return url;
  }
  function translit(str) {
    var ru =
      "А-а-Б-б-В-в-Ґ-ґ-Г-г-Д-д-Е-е-Ё-ё-Є-є-Ж-ж-З-з-И-и-І-і-Ї-ї-Й-й-К-к-Л-л-М-м-Н-н-О-о-П-п-Р-р-С-с-Т-т-У-у-Ф-ф-Х-х-Ц-ц-Ч-ч-Ш-ш-Щ-щ-Ъ-ъ-Ы-ы-Ь-ь-Э-э-Ю-ю-Я-я".split(
        "-"
      );
    var en =
      "A-a-B-b-V-v-G-g-G-g-D-d-E-e-E-e-E-e-ZH-zh-Z-z-I-i-I-i-I-i-J-j-K-k-L-l-M-m-N-n-O-o-P-p-R-r-S-s-T-t-U-u-F-f-H-h-TS-ts-CH-ch-SH-sh-SCH-sch-'-'-Y-y-'-'-E-e-YU-yu-YA-ya".split(
        "-"
      );
    var res = "";
    for (var i = 0, l = str.length; i < l; i++) {
      var s = str.charAt(i),
        n = ru.indexOf(s);
      if (n >= 0) {
        res += en[n];
      } else {
        res += s;
      }
    }
    return res;
  }
  const slug = generate_url(req.body.title);
  const newUserPost = new UserPost({
    ...req.body,
    slug,
    userId: req.user.id,
    // username: req.user.username,
  });
  try {
    const savedUserPost = await newUserPost.save();
    res.status(201).json(savedUserPost);
  } catch (error) {
    console.log(error);
    next(
      errorHandler(
        500,
        "Произошла серверная ошибка, либо такая статья уже существует"
      )
    );
  }
};

export const getPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getUserPosts = async (req, res, next) => {
  try {
    const startIndex = parseInt(req.query.startIndex) || 0;
    const limit = parseInt(req.query.limit) || 12;
    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await UserPost.find({
      isApproved: true,
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ createdAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await UserPost.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await UserPost.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "Вам не разрешено удалять данную статью"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("Статья успешно удалена");
  } catch (error) {
    next(error);
  }
};
export const deleteUserPost = async (req, res, next) => {
  // if (!req.user.isAdmin || req.user.id !== req.params.userId) {
  //   return next(errorHandler(403, "Вам не разрешено удалять данную статью"));
  // }
  try {
    await UserPost.findByIdAndDelete(req.params.postId);
    res.status(200).json("Статья успешно удалена");
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(
      errorHandler(403, "Вам не разрешено редактировать данную статью")
    );
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );

    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
