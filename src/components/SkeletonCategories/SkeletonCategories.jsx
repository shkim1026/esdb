import styles from './SkeletonCategories.module.css';
import { Splide, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'

const SkeletonCategories = () => {
  const sections = [&apos;Trending Movies&apos;, &apos;Top Movies&apos;, &apos;Trending TV&apos;, &apos;Top TV&apos;];

  return (
    <div className={styles.container}>
      {sections.map((section, index) => (
        <div key={index} className={styles.categorySection}>
          <div className={styles.title} />

          <Splide
            options={{
              mediaQuery: 'min',
              gap: '1rem',
              type: 'loop',
              arrows: false,
              pagination: false,
              autoWidth: true,
              autoHeight: true,
              breakpoints: {
                1024: {
                  arrows: true,
                  type: 'slide',
                },
              },
            }}
          >
            {Array.from({ length: 10 }).map((_, i) => (
              <SplideSlide key={i}>
                <div className={styles.cardWrapper}>
                  <img className={styles.cardImage} src="/images/PosterTemplate.png" alt="Placeholder" aria-hidden="true"/>
                  <div className={styles.shimmer} />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>
      ))}
    </div>
  );
}

export default SkeletonCategories;

