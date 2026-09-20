// Since we're using Swiper with Web Components we need to inject some styles directly into its shadow DOM.
export const SWIPER_PAGINATION_STYLES_URL = '/swiper/pagination-element.min.css';

export const SWIPER_PAGINATION_BULLET_STYLES = `
        .swiper-pagination-bullet {
          transition: transform 600ms ease;
        }

        .swiper-pagination-bullet-active {
          transform: scale(1.5);
        }
`;
