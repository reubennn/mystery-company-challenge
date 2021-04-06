/**
 * styled-components index file.
 *
 * - Used so that styled-components can be split into separate files
 * to clean-up and avoid one large file.
 *
 * - This structure allows React Components to import all
 * styled-components {*} as S to allow differentiation between
 * React components and styled-components (which are called using <S.___>).
 *
 * @example
 * // Adds Header styled-component to JSX in React App
 * import * as S from "../styles/styled-components/styled.main";
 * <S.Header >Hello, World!</S.Header>
 */

export * from "./app";
export * from "./navbar";
export * from "./general";
export * from "./pages";
export * from "./forms";
export * from "./table";
