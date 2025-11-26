let deletedCount: number = 0;

document.addEventListener("click", (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    if (target && target !== document.body && target !== document.documentElement) {
        deletedCount++;

        console.log(`Видалено елемент: <${target.tagName.toLowerCase()}>`);
        console.log(`Усього видалено: ${deletedCount}`);

        target.remove();
    }
});
