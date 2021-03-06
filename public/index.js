$(() => loadHoardedJunk());

const loadHoardedJunk = () => {
  clearItems();
  fetch('/api/v1/goods')
  .then(goods => goods.json())
  .then(goods => renderAllJunk(goods));
};

const statusUpdate = (items) => {
  let cleanliness = { Sparkling: 0, Dusty: 0, Rancid: 0 };
  let totalItems  = items.length;
  items.forEach(item => {
    cleanliness[item.cleanliness]++;
  });

  Object.keys(cleanliness).forEach(level => {
    $(`.total-${level}`).text('');
    $(`.total-${level}`).text(cleanliness[level]);
  });

  $('.total-items-span').text(totalItems);
};

const renderAllJunk = (items) => {
  clearItems();
  items.map(item => renderItem(item));
  statusUpdate(items);
};

const clearItems = () => {
  $('.items').empty();
};

class JunkFactory {
  constructor(name, why_tho, cleanliness) {
    this.name        = name;
    this.why_tho     = why_tho;
    this.cleanliness = cleanliness;
  }
}

const inputsValue = () => {
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
  if(inputsValue()){
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
    .then(() => loadHoardedJunk());
  }
};

const deleteItem = (id) => {
  fetch(`/api/v1/goods/${id}`, {
    method: 'DELETE',
    headers: {'Content-Type': 'application/json'}
  })
  .then(response => response.json())
  .then(() => loadHoardedJunk());
};

$('#submit').on('click', (e) => {
  e.preventDefault();
  createItem();
});

const patchCleanliness = (item) => {
  fetch(`/api/v1/goods/${item.id}`, {
    method: 'PATCH',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      cleanliness: item.cleanliness
    })
  })
  .then(response => response.json())
  .then(() => loadHoardedJunk());
};

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

$('.items').on('click', '.item-delete', (e) => {
  const id = e.target.closest('.appended-div').id;
  deleteItem(id);
});

$('.items').on('change', '.item-cleanliness', (e) => {
  const id          = e.target.closest('.appended-div').id;
  const cleanliness = e.target.value;
  const item        =  { id, cleanliness };

  patchCleanliness(item);
});

$('.a-z').on('click', () => sortFetch(sortA));
$('.z-a').on('click', () => sortFetch(sortZ));

const sortFetch = (sort) => {
  fetch('/api/v1/goods')
    .then(response => response.json())
    .then(items => renderAllJunk(sort(items)));
};

const sortA = (items) => {
  return items.sort((a, b) => {
    return a.name > b.name;
  });
};

const sortZ = (items) => {
  return items.sort((a, b) => {
    return b.name > a.name;
  });
};
