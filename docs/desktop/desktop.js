function handleDragStart(e) {
	// Target (this) element is the source node.
	this.style.opacity = '0.4';
	dragSrcEl = this;

	e.dataTransfer.effectAllowed = 'move';
	e.dataTransfer.setData('text/html', this.innerHTML);

}

function handleDragOver(e) {
	if (e.preventDefault) {
		e.preventDefault(); // Necessary. Allows us to drop.
	}

	e.dataTransfer.dropEffect = 'move'; // See the section on the DataTransfer object.
	return false;
}

function handleDragEnter(e) {
	// this / e.target is the current hover target.
	this.classList.add('over');
}

function handleDragLeave(e) {
	this.classList.remove('over'); // this / e.target is previous target element.
}

function handleDrop(e) {
	// this/e.target is current target element.
	if (e.stopPropagation) {
		e.stopPropagation(); // Stops some browsers from redirecting.
	}
	if (e.preventDefault) {
		e.preventDefault(); // Stops Firefox browsers from redirecting.
	}
	// Don't do anything if dropping the same columnDesktop we're dragging.
	if (dragSrcEl != this) {
		// Set the source columnDesktop's HTML to the HTML of the columnDesktop we dropped on.
		dragSrcEl.innerHTML = this.innerHTML;
		this.innerHTML = e.dataTransfer.getData('text/html');
	}
	setTimeout(resetIcons, 100);
	return false;
}

function handleDragEnd(e) {
	// this/e.target is the source node.
	[].forEach.call(cols, function (col) {
		col.classList.remove('over');
	});
}

function resetIcons() {
	var icons = document.getElementsByClassName('columnDesktop');
	for (i = 0; i < icons.length; i++) {
		icons[i].style.opacity = '1.0';
		icons[i].classList.remove('over');
	}
}

var cols = document.querySelectorAll('#columnsDesktop .columnDesktop');
[].forEach.call(cols, function (col) {
	col.addEventListener('dragstart', handleDragStart, false);
	col.addEventListener('dragenter', handleDragEnter, false)
	col.addEventListener('dragover', handleDragOver, false);
	col.addEventListener('dragleave', handleDragLeave, false);
	col.addEventListener('drop', handleDrop, false);
	col.addEventListener('dragend', handleDragEnd, false);
});

var dragSrcEl = null;

var desktopIcons = document.getElementsByClassName("columnDesktop")

var dragIcon = document.createElement('img');
dragIcon.src = 'https://www.w3.org/html/logo/downloads/HTML5_Logo_256.png';
dragIcon.width = 100;
e.dataTransfer.setDragImage(dragIcon, -10, -10);
