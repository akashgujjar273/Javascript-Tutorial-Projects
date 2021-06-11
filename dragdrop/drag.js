/*
drag

It is fired when a dragged item is dragged.

dragend

It is fired when a drag operation ends, such as releasing a mouse button or hitting the Esc key.

dragenter

It is fired when a dragged item enters a valid drop target.

dragexit

It is fired when an element is no longer the drag operation's immediate selection target.

dragleave

It is fired when a dragged item leaves a valid drop target.

dragover

It is fired when a dragged item is being dragged over a valid drop target, every few hundred milliseconds.

dragstart

It is fired when the user starts dragging an item.

drop

It is fired when an item is dropped on a valid drop target.
*/

console.log('This is drag and drop utility');

// images aur box ko select kra
const imgBox = document.querySelector('.imgBox');
const whiteBoxes = document.getElementsByClassName('whiteBox');

// Event listeners for draggable element imgBox
imgBox.addEventListener('dragstart', (e) => {
    console.log('DragStart has been triggered');
    //jispr target lgaya h uski class m add krdo y hold vali css
    e.target.className += ' hold';
    // 0 ka mtlb sb execute hone k baad hide ko chlana
    setTimeout(() => {
        e.target.className = 'hide';
    }, 0);

});

imgBox.addEventListener('dragend', (e) => {
    console.log('DragEnd has been triggered');
    e.target.className = 'imgBox';// jese hi chor denge to vo vala box imgbox ho jaiga img usme ajayegi 
    // y drop krne pr hide krne nhi degi
});

// saare boxes ko iterate krke select krlia
for (whiteBox of whiteBoxes) {
    whiteBox.addEventListener('dragover', (e) => {
        e.preventDefault(); // iski madat se default drag hatt jaiga aur drop kr payenge
        console.log('DragOver has been triggered');
    });

    whiteBox.addEventListener('dragenter', (e) => {
        console.log('DragEnter has been triggered');
        //enter krne pr dsh class krdena
        e.target.className += ' dashed'; 
    })

    whiteBox.addEventListener('dragleave', (e) => {
        console.log('DragLeave has been triggered');
        //leave krne pr white box class krdena
        e.target.className = 'whiteBox'
    })

    whiteBox.addEventListener('drop', (e) => {
        console.log('Drop has been triggered');
        e.target.append(imgBox);//target k ander imgbox ko append krdo
    })
}
