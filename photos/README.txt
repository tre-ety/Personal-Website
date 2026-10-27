HOW TO ADD PHOTOS TO THE GALLERY
================================

The gallery does not pick up files automatically. Each photo needs two
resized copies and one line in photography.html.

1. Make two copies of the photo, both saved as .jpg with the same lowercase
   name (for example red-fox.jpg):
      photos/web/     about 1800 x 1200 pixels (shown when a photo is opened)
      photos/thumbs/  900 x 600 pixels (shown in the grid)

2. Open photography.html, find the list that starts "var photos = [",
   and add a line in the order you want it to appear:
      {file:"red-fox.jpg",alt:"Red fox crossing a path in Richmond Park"},
   The alt text is what screen readers announce, so describe the photo.

3. Every sixth photo is shown as a large tile. Keep the total number of
   photos a multiple of three, otherwise the grid ends with a gap.

Original camera files do not belong in this folder; keep them outside the
site so they are not uploaded.
