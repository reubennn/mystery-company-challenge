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
 * // Adds Feature Text styled-component to JSX in React App
 * import * as S from "../styles/styled-components/styled";
 * <S.FeatureText >Hello, World!</S.FeatureText>
 */

export * from "./app";
export * from "./pages";
export * from "./general";
