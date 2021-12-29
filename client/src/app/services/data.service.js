const urlApi =
  "https://iot.constecoin.com/api/gpf/humitemp/dashboard/getDataAux/";

// GET ALL
export async function getData() {
  const response = await fetch(urlApi, {
    headers: {
      Authorization: "Constecoin",
      "Content-Type": "application/json;charset=utf-8",
    },
  }).then((result) => result.json());
  return response;
}

// GET BY ID
export async function getDataById(id) {}

// POST DATA
export async function postData(data) {}

// UPDATE DATA
export async function updateData(id, data) {}

// DELETE DATA
export async function deleteData(id) {}

//
