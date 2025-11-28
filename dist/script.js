let deletedCount = 0;
import { CursorGifTracker } from './modules/gifplayer/gifplayer.js';
document.addEventListener("click", (event) => {
    const target = event.target;
    if (target && target !== document.body && target !== document.documentElement) {
        deletedCount++;
        console.log(`Видалено елемент: <${target.tagName.toLowerCase()}>`);
        console.log(`Усього видалено: ${deletedCount}`);
        target.remove();
    }
});
document.addEventListener('DOMContentLoaded', () => {
    const gifTracker = new CursorGifTracker();
});
//# sourceMappingURL=script.js.map