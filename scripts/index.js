const fontSizeSlider = document.getElementById('fontSizeSlider');
const lineHeightSlider = document.getElementById('lineHeightSlider');
const qrWidthSlider = document.getElementById('qrWidthSlider');
const qrHeightSlider = document.getElementById('qrHeightSlider');
var attributes;
let selectedElementId = null;

window.onload = function () {
    changePageSize();
};


function changePageSize() {
    var selectedSize = document.getElementById("pageType").value;
    var customSelect = document.getElementById("page-type-slider");
    var previewPage = document.getElementById("previewPage");
    var orientation = document.querySelector(".mode-btn.clicked").id === "landscapeBtn" ? "landscape" : "portrait";
    var width, height;

    switch (selectedSize) {
        case "A4":
            width = orientation === "landscape" ? "297mm" : "210mm";
            height = orientation === "landscape" ? "210mm" : "297mm";
            customSelect.style.display = "none";

            break;
        case "A5":
            width = orientation === "landscape" ? "210mm" : "148mm";
            height = orientation === "landscape" ? "148mm" : "210mm";
            customSelect.style.display = "none";

            break;
        case "A6":
            width = orientation === "landscape" ? "148mm" : "105mm";
            height = orientation === "landscape" ? "105mm" : "148mm";
            customSelect.style.display = "none";

            break;

        case "Custom":
            handleCustomOption();
            width = Math.max(document.getElementById("widthRange").value, 78) + "mm";
            height = Math.max(document.getElementById("heightRange").value, 86) + "mm";

            if (orientation === "landscape") {
                var temp = width;
                width = height;
                height = temp;
            }
            break;
        default:
            break;

    }

    previewPage.style.width = width;
    previewPage.style.height = height;

    $(".drag").each(function () {
        // Calculate new position based on percentage of old position relative to old dimensions
        var oldWidth = parseFloat($(this).parent().css('width'));
        console.log("Old Width : ", oldWidth)
        var oldHeight = parseFloat($(this).parent().css('height'));
        var oldLeft = parseFloat($(this).css('left'));
        var oldTop = parseFloat($(this).css('top'));
        var newLeft = (oldLeft / oldWidth) * parseFloat(width);
        var newTop = (oldTop / oldHeight) * parseFloat(height);
        $(this).css({ left: newLeft + 'px', top: newTop + 'px' });

        // console.log('testNew is : ',$(this).css({left: newLeft + 'px', top: newTop + 'px'}))
    });
}

function handleCustomOption() {
    var customSelect = document.getElementById("page-type-slider");
    customSelect.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    const landscapeButton = document.getElementById('landscapeBtn');
    const portraitButton = document.getElementById('portraitBtn');

    function clearButtonSelection() {
        landscapeButton.classList.remove('landscape', 'clicked');
        portraitButton.classList.remove('portrait', 'clicked');
    }

    landscapeButton.addEventListener('click', function () {
        clearButtonSelection();
        this.classList.add('landscape', 'clicked');
        changePageSize();
    });

    portraitButton.addEventListener('click', function () {
        clearButtonSelection();
        this.classList.add('portrait', 'clicked');
        changePageSize();
    });

    portraitButton.click();

    function openDesignTools(elementId) {

        selectedElementId = elementId;
        storeData();
        const attributeObject = JSON.parse(sessionStorage.getItem('attributes'));

        const designToolsSection = document.getElementById("designTools");
        const qrSizeSlider = document.getElementById("qrSizeSlider");
        const clickedItem = document.getElementById(elementId);
        const allItems = document.querySelectorAll(".profile-input");

        allItems.forEach(function (item) {
            item.style.borderColor = 'rgba(14, 13, 13, 0.14)';
            if (elementId !== 'qrImage') {
                document.getElementById('qrImage').style.border = 'none';
                qrSizeSlider.style.display = "none";
                designToolsSection.style.display = "block";
                clickedItem.style.borderColor = '#ce558f';
            }
            else {
                qrSizeSlider.style.display = "block";
                designToolsSection.style.display = "none";
                clickedItem.style.border = '1px solid #ce558f';
            }
        });

        if (attributeObject && attributeObject[elementId]) {
            updateAndResetDesignTools(attributeObject[elementId]);
        }
    }

    //upadte and reset the design tools on each element (profileName,company,designation) selected.
    function updateAndResetDesignTools(data) {

        // Reset font size slider
        document.getElementById("fontSizeSlider").value = parseInt(data.txtSize, 10);
        document.getElementById("fontsizeTooltip").innerText = data.txtSize;

        // Reset line height slider
        document.getElementById("lineHeightSlider").value = parseInt(data.txtLineheight, 10);
        document.getElementById("lineheightTooltip").innerText = data.txtLineheight;

        // Reset text alignment radio buttons
        if (data.txtAlignment) {
            document.querySelector(`input[name="position"][value="${data.txtAlignment}"]`).checked = true;
        }

        if (data.txtWeight) {
            document.querySelector(`input[name="weight"][value="${data.txtWeight}"]`).checked = true;
        }

        // Reset font style radio buttons
        if (data.txtStyle) {
            document.querySelector(`input[name="style"][value="${data.txtStyle}"]`).checked = true;
        }

        // Reset font color
        if (data.txtcolor) {
            var hexColor = rgbToHex(data.txtcolor);
            document.getElementById("colorBox").value = hexColor;
            document.querySelector('.color-value').innerText = hexColor;
        }

    }

    window.openDesignTools = openDesignTools;


});

function updateTooltip(element) {
    var tooltip = element.nextElementSibling;
    tooltip.innerHTML = element.value + "mm";
}

qrWidthSlider.addEventListener('input', () => {
    const selectedElement = document.getElementById('qrPhoto');
    selectedElement.style.width = `${qrWidthSlider.value}px`;
    // Update sessionStorage
    attributes[selectedElementId].width = `${qrWidthSlider.value}px`;;
    sessionStorage.setItem('attributes', JSON.stringify(attributes));
});

qrHeightSlider.addEventListener('input', () => {
    const selectedElement = document.getElementById('qrPhoto');
    selectedElement.style.height = `${qrHeightSlider.value}px`;
    // Update sessionStorage
    attributes[selectedElementId].height = `${qrHeightSlider.value}px`;
    sessionStorage.setItem('attributes', JSON.stringify(attributes));
});


fontSizeSlider.addEventListener('input', () => {
    const selectedElement = document.getElementById(selectedElementId);
    var textFontSize = `${fontSizeSlider.value}px`;
    selectedElement.style.fontSize = textFontSize;
    // Update sessionStorage
    attributes[selectedElementId].txtSize = textFontSize;
    sessionStorage.setItem('attributes', JSON.stringify(attributes));


});

lineHeightSlider.addEventListener('input', () => {
    const selectedElement = document.getElementById(selectedElementId);
    var textLineHeight = `${lineHeightSlider.value}px`;
    selectedElement.style.lineHeight = textLineHeight;
    // Update sessionStorage
    attributes[selectedElementId].txtLineheight = textLineHeight;
    sessionStorage.setItem('attributes', JSON.stringify(attributes));

});

function updateTooltiptxt(element) {
    var tooltip = element.nextElementSibling;
    tooltip.innerHTML = element.value + "px";
}

function changeTextAlign(align) {
    var selectedElement = document.getElementById(selectedElementId);
    selectedElement.style.textAlign = align;
}

function changeFontWeight(weight) {
    var selectedElement = document.getElementById(selectedElementId);
    selectedElement.style.fontWeight = weight;
}

function changeFontStyle(style) {
    var selectedElement = document.getElementById(selectedElementId);
    selectedElement.style.fontStyle = style;
}

function changeFontColor(color) {
    var selectedElement = document.getElementById(selectedElementId);
    var colorValueSpan = document.querySelector('.color-value');
    selectedElement.style.color = color;
    colorValueSpan.textContent = color;
}

function rotateNameElement() {
    const selectedElement = document.getElementById(selectedElementId);

    const rotationClasses = ['rotate-0', 'rotate-90', 'rotate-180', 'rotate-270'];
    const currentRotationClass = rotationClasses.find(cls => selectedElement.classList.contains(cls));
    if (currentRotationClass === 'rotate-270') {
        selectedElement.classList.replace(currentRotationClass, rotationClasses[0]);

    }
    else {
        const currentRotationIndex = rotationClasses.indexOf(currentRotationClass);
        selectedElement.classList.replace(currentRotationClass, rotationClasses[currentRotationIndex + 1]);
    }

}

$(document).ready(function () {

    $(".drag").draggable({
        opacity: 0.5,
        containment: "#previewPage"
    });

    $(".profile-input").droppable({
        drop: function (event, ui) {
            // Revert the draggable back to its original position
            ui.draggable.animate({
                top: 0,
                left: 0
            });
            alert("Cannot drop, target element is not empty or draggable element position mismatch.");

        }
    });



});


function printPreview() {
    var stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
    var styles = '';
    stylesheets.forEach(function (stylesheet) {
        styles += '<link rel="stylesheet" href="' + stylesheet.href + '">';
    });
    var previewContent = document.getElementById('previewArea').innerHTML;
    var printWindow = window.open('', '_blank');
    printWindow.document.open();

    printWindow.document.write('<html><head><title>Print Preview</title>' + styles + '</head><body>');
    printWindow.document.write('<div style="border-top: 2px solid rgba(185, 146, 146, 0.14);">');
    printWindow.document.write(previewContent);
    printWindow.document.write('</div>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.print();
}

function getItemFromStorage() {
    const attributeObject = JSON.parse(sessionStorage.getItem('attributes'));
    if (!attributeObject) {
        console.log('No attributes found in sessionStorage');
        return;
    }

    const keys = Object.keys(attributeObject);

    keys.forEach(key => {
        switch (key) {
            case 'qrImage':
                updateAndResetDesignTools(attributeObject.qrImage);
                break;
            case 'profileName':
                updateAndResetDesignTools(attributeObject.profileName);
                break;
            case 'company':
                updateAndResetDesignTools(attributeObject.company);
                break;
            case 'designation':
                updateAndResetDesignTools(attributeObject.designation);
                break;
            default:
                console.log('Not a valid elementId');
                break;
        }
    });
}


function downloadJSON(data, filename) {
    var json = JSON.stringify(data, null, 2);
    var blob = new Blob([json], { type: "application/json" });
    var url = URL.createObjectURL(blob);

    var a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function saveData() {
    storeData();
    downloadJSON(attributes, 'attributes.json');
}


function storeData() {
    var previewElements = document.querySelectorAll('.txt-format');
    var qrImage = document.getElementById('qrPhoto');
    var qrImageStyles = window.getComputedStyle(qrImage);
    console.log('Computed Style : ' , qrImageStyles);
    var data = {
        qrImage: {
            width: qrImageStyles.getPropertyValue('width'),
            height: qrImageStyles.getPropertyValue('height'),
            coordinates: qrImage.getBoundingClientRect()
        }
    };

    previewElements.forEach(function (element) {
        element.addEventListener('input', function () {
            updateAttributes(element);
        });
    });

    previewElements.forEach(function (element) {
        updateAttributes(element);
    });


    function updateAttributes(element) {
        var elementId = element.id;
        var elementStyles = window.getComputedStyle(element);
        var elementData = {
            txtSize: elementStyles.getPropertyValue('font-size'),
            txtLineheight: elementStyles.getPropertyValue('line-height'),
            txtcolor: elementStyles.getPropertyValue('color'),
            txtAlignment: elementStyles.getPropertyValue('text-align'),
            txtWeight: elementStyles.getPropertyValue('font-weight'),
            txtStyle: elementStyles.getPropertyValue('font-style'),
            txtRotation: elementStyles.getPropertyValue('transform'),
            txtCoordinates: element.getBoundingClientRect(),
        };

        if (elementData.txtLineheight === 'normal') {
            elementData.txtLineheight = '20px';
        }


        switch (elementData.txtWeight) {
            case '800':
                elementData.txtWeight = 'Bold';
                break;

            case '600':
                elementData.txtWeight = 'Medium';
                break;
            case '400':
                elementData.txtWeight = 'Normal';
                break;

            case '100':
                elementData.txtWeight = 'Light';
                break;

            default:
                elementData.txtWeight = 'Normal';
                break;
        }

        data[elementId] = elementData;
        attributes = data;
        sessionStorage.setItem('attributes', JSON.stringify(attributes));

    }

}

function rgbToHex(rgb) {
    var rgbArray = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    var hex = "#" +
        ("0" + parseInt(rgbArray[1], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgbArray[2], 10).toString(16)).slice(-2) +
        ("0" + parseInt(rgbArray[3], 10).toString(16)).slice(-2);
    return hex;
}
