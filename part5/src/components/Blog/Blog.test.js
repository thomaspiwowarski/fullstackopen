import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";
import userEvent from "@testing-library/user-event";

describe("<Blog />", () => {
  const blog = {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  };
  const blogs = [];
  const setBlogs = () => null;
  const loggedUser = "mockuser";

  test("renders content", () => {
    const { container } = render(
      <Blog
        blog={blog}
        blogs={blogs}
        setBlogs={setBlogs}
        loggedUser={loggedUser}
      />
    );

    expect(container).toHaveTextContent(blog.title);
    expect(container).toHaveTextContent(blog.author);
    expect(container).not.toHaveTextContent(blog.url);
    expect(container).not.toHaveTextContent(blog.likes);
  });

  test("clicking button shows url and likes", async () => {
    const { container } = render(
      <Blog
        blog={blog}
        blogs={blogs}
        setBlogs={setBlogs}
        loggedUser={loggedUser}
      />
    );

    const user = userEvent.setup();
    const button = screen.getByText("view");
    await user.click(button);

    expect(container).toHaveTextContent(blog.url);
    expect(container).toHaveTextContent(blog.likes);
  });

  test("clicking button twice calls event handler twice", async () => {
    const mockHandler = jest.fn();
    render(
      <Blog
        blog={blog}
        blogs={blogs}
        setBlogs={setBlogs}
        loggedUser={loggedUser}
        handlerForTest={mockHandler}
      />
    );

    const user = userEvent.setup();
    const viewButton = screen.getByText("view");
    await user.click(viewButton);
    const likeButton = screen.getByText("like");
    await user.click(likeButton);
    await user.click(likeButton);

    expect(mockHandler.mock.calls).toHaveLength(2);
  });
});
