$(() => loadHoardedJunk());

const loadHoardedJunk = () => {
  fetch('/api/v1/goods')
  .then(goods => goods.json());
};

class JunkFactory {
  constructor(name, why_tho, cleanliness) {
    this.name        = name;
    this.why_tho     = why_tho;
    this.cleanliness = cleanliness;
  }
}