
// // describe("", () => {});


// // test suite 
// describe("demo tests", () => {

//     // test cases 
//     // it("", () => {});

//     it("addition function", () => {
//         expect(5 + 5).toBe(10);
//     });

//     it("addition function negative test 1", () => {
//         expect(5 + 5).not.toBe(10);
//     });

//     it("addition function negative test 1", () => {
//         expect(5 + 5).not.toBe(9);
//     });

// });



import { render, screen, fireEvent } from "@testing-library/react";
import About from "../../../features/other/pages/About";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { describe, it, expect } from "vitest";

describe("About Component", () => {

    it("addition positive test", () => {
        expect(5 + 5).toBe(10);
    });

    it("component loads", () => {
        renderWithRedux();
        expect(screen.getByText("About Component")).toBeInTheDocument();

    });


    it("renders component", () => {
        renderWithRedux();
        expect(screen.getByText("About Component")).toBeInTheDocument();
    });

    it("shows error when username is empty", () => {
        renderWithRedux();

        fireEvent.click(screen.getByDisplayValue("Submit"));

        expect(screen.getByText("Username is required.")).toBeInTheDocument();
    });

    it("valid form submission works", () => {
        renderWithRedux();

        const usernameInput = screen.getByRole("textbox") as HTMLInputElement;
        const passwordInput = document.querySelector("input[type='password']") as HTMLInputElement;

        usernameInput.value = "Vaman";
        passwordInput.value = "Abc@1234";

        fireEvent.click(screen.getByDisplayValue("Submit"));

        expect(screen.getByText(/Output:/)).toHaveTextContent("Vaman");
    });

    const mockReducer = (state = { username: "", password: "" }, action: any) => {
        if (action.type === "about/saveData") {
            return action.payload;
        }
        return state;
    };

    const createTestStore = () =>
        configureStore({
            reducer: {
                about: mockReducer
            }
        });

    const renderWithRedux = () => {
        const store = createTestStore();
        return render(
            <Provider store={store}>
                <About />
            </Provider>
        );
    };

});