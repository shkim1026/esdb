import styles from './SkeletonCategories.module.css';

const SkeletonCategories = () => {
  const sections = ['Trending Movies', 'Top Movies', 'Trending TV', 'Top TV'];

  return (
    <div className={styles.container}>
      {sections.map((section, index) => (
        <div key={index} className={styles.categorySection}>
          <div className={styles.title} />
          <div className={styles.splideContainer}>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={styles.card} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonCategories;
