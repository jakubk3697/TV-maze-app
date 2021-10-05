export const getShowsByKey = (key) => {
  fetch(`https://api.tvmaze.com/search/shows?q=${key}`).then((res) => res.json());
};

export const showById = (id) => {
  fetch(`https://api.tvmaze.com/shows/${id}?embed=cast`).then((res) => res.json());
};
