import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import BlogForm from "./BlogForm";
import userEvent from "@testing-library/user-event";

describe("<BlogForm />", () => {
  test("calls event handler passed with prop", async () => {
    const mockHandler = jest.fn();

    render(<BlogForm handleAddNewBlog={mockHandler} />);
    const authorInput = screen.getByPlaceholderText("author");
    const titleInput = screen.getByPlaceholderText("title");
    const urlInput = screen.getByPlaceholderText("url");
    const sendButton = screen.getByText("add blog");

    console.log(sendButton);

    await userEvent.type(authorInput, "test author");
    await userEvent.type(titleInput, "test title");
    await userEvent.type(urlInput, "test url");
    await userEvent.click(sendButton);

    expect(mockHandler.mock.calls).toHaveLength(1);
    expect(mockHandler.mock.calls[0][0].author).toBe("test author");
    expect(mockHandler.mock.calls[0][0].title).toBe("test title");
    expect(mockHandler.mock.calls[0][0].url).toBe("test url");
  });
});
