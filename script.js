let deletedCount = 0;
document.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target !== document.body && target !== document.documentElement) {
        deletedCount++;
        console.log(`Видалено елемент: <${target.tagName.toLowerCase()}>`);
        console.log(`Усього видалено: ${deletedCount}`);
        target.remove();
    }
});
export {};
//# sourceMappingURL=script.js.map