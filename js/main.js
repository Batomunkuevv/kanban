
//slider swap
(() => {

  let wrap = document.querySelector('.kanban');
  let slider = document.querySelector('.kanban__wrap');
  let shift = 0;
  let diff = 0;
  let flag = false;
  let itemSlider = document.querySelector('.kanban__column');
  let x1 = null;
  let y1 = null;

  slider.addEventListener('touchstart', handleTouchStart, false);
  slider.addEventListener('touchmove', handleTouchMove, false);


  function handleTouchStart(e) {
    if (e.target.className == 'kanban__item' || e.target.closest('.kanban__item')) {
      return
    }
    const firstTouch = e.touches[0];
    x1 = firstTouch.clientX;
    y1 = firstTouch.clientY;

  }

  function handleTouchMove(e) {
    if (e.target.className == 'kanban__item' || e.target.closest('.kanban__item')) {
      return
    }

    if (!x1 || !y1) {
      return false;
    }
    let x2 = e.touches[0].clientX;
    let y2 = e.touches[0].clientY;

    let xDif = x2 - x1;
    let yDif = y2 - y1;

    if (Math.abs(xDif) > Math.abs(yDif)) {
      if (xDif > 0) {
        prevCompas();
      }
      else {
        nextCompas();
      }
    }
    x1 = null;
    y1 = null;
  }


  function nextCompas() {
    let dlItem = itemSlider.offsetWidth;
    let dlWrap = wrap.offsetWidth;
    let dlSlider = slider.offsetWidth;

    if ((dlWrap + (shift - dlItem)) > dlSlider) {
      shift = shift - dlItem - 16;
      wrap.style.left = shift + 'px';
      return;
    } else {
      if (flag) {
        return;
      }
      wrap.style.left = (dlSlider - dlWrap) + 'px';

      diff = (dlSlider - dlWrap) - shift;
      shift = (dlSlider - dlWrap);
      flag = true;
    }
  };


  function prevCompas() {
    let dlItem = itemSlider.offsetWidth;
    if (flag) {
      shift = shift - diff;
      wrap.style.left = shift + 'px';

      flag = false;
      return;
    }
    if (shift == 0) {
      return;
    }
    shift = shift + dlItem + 16;
    wrap.style.left = shift + 'px';

  };

})();


// drag and drop mobile
(() => {

  let element = document.querySelectorAll('.kanban__item');
  let parents = document.querySelectorAll('.kanban__list');
  let box = document.querySelector('.kanban');
  let wrapper = document.querySelector('.app-wrapper');
  let num = null;

  let x1 = null;
  let y1 = null;

  for (let i = 0; i < element.length; i++) {
    element[i].addEventListener('touchstart', dragTouchStart, false);
    element[i].addEventListener('touchmove', dragTouchMove, false);
    element[i].addEventListener('touchend', dragTouchEnd, false);
  }


  function getList(parElemData) {
    let num;
    parents.forEach((el, n) => {
      if (el.getAttribute('data-num') == parElemData) {
        num = n;
      }
    });
    return num;
  }

  function adaptiveHeight() {
    let heightBox = box.offsetHeight
    wrapper.style.height = heightBox + 100 + 'px';

  }
  adaptiveHeight();



  function dragTouchStart(e) {
    const firstTouch = e.touches[0];
    x1 = firstTouch.clientX;
    y1 = firstTouch.clientY;
    let parElemData = this.closest('.kanban__list').getAttribute('data-num')
    num = getList(parElemData);

  }

  function dragTouchMove(e) {

    let x2 = e.touches[0].clientX;
    let y2 = e.touches[0].clientY;

    let xDif = x2 - x1;
    let yDif = y2 - y1;


    this.style.left = `${xDif}px`;
    if (num == 0 && xDif < 0) {
      this.style.left = 0 + 'px';
    }
    if (num == 0 && xDif > 720) {
      this.style.left = 720 + 'px';
    }
    if (num == 3 && xDif > 0) {
      this.style.left = 0 + 'px';
    }
    if (num == 3 && xDif < -720) {
      this.style.left = -720 + 'px';
    }
    if (num == 1 && xDif < -240) {
      this.style.left = -240 + 'px';
    }
    if (num == 1 && xDif > 480) {
      this.style.left = 480 + 'px';
    }
    if (num == 2 && xDif < -480) {
      this.style.left = -480 + 'px';
    }
    if (num == 2 && xDif > 240) {
      this.style.left = 240 + 'px';
    }

    this.style.top = `${yDif}px`;

    e.preventDefault();

  }

  function taskNormal(elem, num, top) {
    let res = 0;
    let a = parents[num].querySelectorAll('.kanban__item');
    for (let i = 0; i < a.length; i++) {
      res += a[i].offsetHeight;
      if (top < res - (a[i].offsetHeight / 2)) {
        parents[num].insertBefore(elem, a[i]);
        elem.style.left = 'inherit';
        elem.style.top = 'inherit';
        return;
      }
    };
    parents[num].appendChild(elem);
    elem.style.left = 'inherit';
    elem.style.top = 'inherit';
  }


  function dragTouchEnd(e) {
    let left = this.style.left.slice(0, -2);
    let top = e.changedTouches[0].pageY - 53;
    let elem = this;


    if (num == 0) {


      if (left < 120) {
        taskNormal(elem, num, top);
      }
      if (left > 120 && left < 360) {
        let n = num + 1;
        taskNormal(elem, n, top);
      }
      if (left > 360 && left < 600) {
        let n = num + 2;
        taskNormal(elem, n, top);
      }
      if (left > 600) {
        let n = num + 3;
        taskNormal(elem, n, top);
      }
    }
    if (num == 1) {
      if (left < -120) {
        let n = num - 1;
        taskNormal(elem, n, top);
      }
      if (left > -120 && left < 120) {
        taskNormal(elem, num, top);
      }
      if (left > 120 && left < 360) {
        let n = num + 1;
        taskNormal(elem, n, top);
      }
      if (left > 360) {
        let n = num + 2;
        taskNormal(elem, n, top);
      }
    }

    if (num == 2) {
      if (left < -120 && left > -360) {
        let n = num - 1;
        taskNormal(elem, n, top);
      }
      if (left < -360) {
        let n = num - 2;
        taskNormal(elem, n, top);
      }
      if (left > -120 && left < 120) {
        taskNormal(elem, num, top);
      }
      if (left > 120) {
        let n = num + 1;
        taskNormal(elem, n, top);
      }
    }

    if (num == 3) {
      if (left > -120) {
        taskNormal(elem, num, top);
      }
      if (left < -120 && left > -360) {
        let n = num - 1;
        taskNormal(elem, n, top);
      }
      if (left < -360 && left > -600) {
        let n = num - 2;
        taskNormal(elem, n, top);
      }

      if (left < -600) {
        let n = num - 3;
        taskNormal(elem, n, top);
      }
    }

    adaptiveHeight();
    x1 = null;
    y1 = null;
  }


})();