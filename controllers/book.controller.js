const Book = require("../models/book.model");
const Response = require("../libs/response");
const Error = require("../libs/error");

exports.createBook = async (req, res) => {
  try {
    const { title, description, author, price } = req.body;
    const { _id } = req.user;
    const newBook = await Book.create({
      title,
      description,
      author,
      price,
      userId: _id,
    });
    return Response(res).success({ data: newBook }, 201);
  } catch (error) {
    return Response(res).error(error.message, 500);
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const removedBook = await Book.findOneAndRemove({ _id: id });
    if (!removedBook) {
      throw Error("Id Not Found!", "BAD REQUEST", 401);
    }
    return Response(res).success({ data: removedBook }, 204);
  } catch (error) {
    return Response(res).error(error, 500);
  }
};

exports.changeBook = async (req, res) => {
  try {
    const { id } = req.params;
    const updateBook = await Book.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
      upsert: true,
    });
    if (!updateBook) {
      throw Error("Id Not Found!", "BAD REQUEST", 401);
    }
    return Response(res).success({ data: updateBook }, 200);
  } catch (error) {
    return Response(res).error(error.message, 500);
  }
};

exports.approveBookRequest = async (req, res) => {
  try {
    const { book_type } = req.body;
    const findBook = await Book.findOne({ title: book_type });
    if (!findBook) {
      throw Error("Book is not available", "BAD REQUEST", 401);
    }
    return Response(res).success({ data: updateBook }, 200);
  } catch (error) {
    return Response(res).error(error.message, 500);
  }
};
