// 1. Copy selected text to the clipboard on mouseup
// When the user selects text and releases the mouse button, this copies the selected text to the clipboard.
// If no text is selected, the function does nothing.
document.addEventListener('mouseup', async (event) => {
  // If the target is a textarea or a text box, exit the function.
  if (event.target.matches('textarea, input, [role="textbox"] *')) return;

  const selectedText = window.getSelection().toString().trim();  // Retrieve the selected text and trim any whitespace.

  // If selected text exists, copy it to the clipboard.
  if (selectedText) {
    try {
      await navigator.clipboard.writeText(selectedText);  // Copy the retrieved text to the clipboard.
      console.log('Copied to clipboard: ', selectedText);  // Log the copied content to the console.
    } catch (error) {
      console.error('Failed to copy text: ', error);  // If the copy fails, log the error to the console.
    }
  }
});

// 2. Paste clipboard content into text areas or text boxes with a mouse wheel click
// On middle click (wheel click), paste clipboard text into a text area or text box.
// If the clicked target is not a text input field, do nothing.
// Also, disable the auto-scroll feature to prevent unintended actions.
document.addEventListener('mousedown', async (event) => {
  if (event.button === 1) {  // Middle click (mouse wheel click)
    event.preventDefault();  // Disable auto-scroll

    const targetElement = event.target;

    // Perform the paste only if the clicked element is a text area or text box.
    if (targetElement.matches('textarea, input[type="text"], input[type="search"]')) {
      targetElement.focus();  // Activate the clicked element.

      try {
        const clipboardText = await navigator.clipboard.readText();  // Retrieve the clipboard content.
        // Insert the clipboard text at the current cursor position.
        targetElement.setRangeText(clipboardText, targetElement.selectionStart, targetElement.selectionEnd, 'end');
      } catch (error) {
        console.error('Failed to read clipboard: ', error);  // If clipboard reading fails, log the error to the console.
      }
    }
  }
});

// 3. Clear text boxes with a mouse wheel scroll
// When the user scrolls the wheel over a text box, this clears the content of that text box.
// If the target is not a text box, the function does nothing, but if it is, it clears the content.
// After clearing, the text box will be focused and activated.
document.addEventListener('wheel', (event) => {
  const targetElement = event.target;

  // If the target is not a text box, exit the function.
  if (!targetElement.matches('input[type="text"], input[type="search"]')) return;

  event.preventDefault();  // Disable page-wide scrolling.

  targetElement.value = '';  // Clear all content from the text box.
  targetElement.focus();  // Activate the text box after clearing.
}, { passive: false });  // Set passive: false to allow preventDefault()

// 4. Change dropdown menu options with a mouse wheel scroll
// When the user scrolls the wheel over a dropdown menu (<select> element), this changes the selected option.
// If the target is not a dropdown menu, do nothing; otherwise, change the selected option.
// Scroll up to select the previous option, scroll down to select the next option based on the wheel movement.
document.addEventListener('wheel', (event) => {
  const targetElement = event.target;

  // If the target is not a dropdown menu, exit the function.
  if (!targetElement.matches('select')) return;

  event.preventDefault();  // Disable page-wide scrolling.

  const delta = event.deltaY;  // Get the amount of wheel movement.

  // If the wheel is scrolled up, move the selection to the previous option.
  if (delta < 0 && targetElement.selectedIndex > 0) {
    targetElement.selectedIndex -= 1;
  }
  // If the wheel is scrolled down, move the selection to the next option.
  else if (delta > 0 && targetElement.selectedIndex < targetElement.options.length - 1) {
    targetElement.selectedIndex += 1;
  }
}, { passive: false });  // Set passive: false to allow preventDefault()

// 5. Scroll page by dragging with middle mouse button
// When the user clicks the middle mouse button and drags, scroll the page proportionally to the mouse movement.
// The scrolling is controlled by displacement, not speed, and the proportional factor is adjustable.
let isMiddleMouseDragging = false;
let startX = 0;
let startY = 0;
let scrollStartX = 0;
let scrollStartY = 0;
const scrollFactor = 8;  // Adjust this factor to control scrolling sensitivity.

document.addEventListener('mousedown', (event) => {
  if (event.button === 1) {  // Middle mouse button
    event.preventDefault();
    isMiddleMouseDragging = true;
    startX = event.clientX;
    startY = event.clientY;
    scrollStartX = window.scrollX;
    scrollStartY = window.scrollY;
  }
});

document.addEventListener('mousemove', (event) => {
  if (isMiddleMouseDragging) {
    const deltaX = (event.clientX - startX) * scrollFactor;
    const deltaY = (event.clientY - startY) * scrollFactor;
    window.scrollTo(scrollStartX + deltaX, scrollStartY + deltaY);
  }
});

document.addEventListener('mouseup', (event) => {
  if (event.button === 1) {  // Middle mouse button
    isMiddleMouseDragging = false;
  }
});
