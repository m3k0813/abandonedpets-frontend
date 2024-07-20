// SVG 파일을 모듈로 선언
declare module '*.svg' {
    const content: any;
    export default content;
}

// PNG 파일을 모듈로 선언
declare module '*.png' {
    const content: any;
    export default content;
}
