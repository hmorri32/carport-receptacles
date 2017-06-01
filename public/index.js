
$(() => {
  loadHoardedJunk();
  resetInputs();
});

const loadHoardedJunk = () => {
  fetch('/api/v1/goods')
  .then(goods => goods.json())
  .then((goods) => renderAllJunk(goods));
};

const renderAllJunk = (items) => {
  $('.items').empty();
  items.map(item => renderItem(item));
};

class JunkFactory {
  constructor(name, why_tho, cleanliness) {
    this.name        = name;
    this.why_tho     = why_tho;
    this.cleanliness = cleanliness;
  }
}

const inputValue = () => {
  return $('#item-name').val() && $('#why-tho').val() ? true : false;
};

const resetInputs = () => {
  $('#item-name').val('');
  $('#why-tho').val('');
};

const createItem = () => {
  const name         = $('#item-name').val();
  const why          = $('#why-tho').val();
  const cleanliness  = $('.select-cleanliness').val();
  const item         = new JunkFactory(name, why, cleanliness);
  postItem(item);
  resetInputs();
};

const postItem = (item) => {
  if(inputValue()){
    fetch('/api/v1/goods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: item.name,
        why_tho: item.why_tho,
        cleanliness: item.cleanliness
      })
    })
    .then(response => response.json())
    .then(item => renderItem(item[0]));
  }
};

$('#submit').on('click', (e) => {
  e.preventDefault();
  createItem();
});

const renderItem = (item) => {
  $('.items').append(`
    <div id='${item.id}' class='appended-div'>
        <p class='item'>Name: <span class='item-attr'>${item.name}</span></p>
        <p class='item'>Why Tho? <span class='item-attr'>${item.why_tho}</span></p>
        <p class='item'>Cleanliness: <span class='item-attr'>${item.cleanliness}</span></p>
      <div class='rendered-inputs'>
        <button class='item-delete'>DELETE</button>
        <select class='item-cleanliness'>
                  <option>UPDATE</otion>
                  <option>Sparkling</option>
                  <option>Dusty</option>
                  <option>Rancid</option>
        </select>
      </div>
    </div>
  `);
};