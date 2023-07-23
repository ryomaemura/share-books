const nameForm = document.getElementById("nameForm");
const nameInput = document.getElementById("nameInput");
const commentForm = document.getElementById("commentForm");
const commentInput = document.getElementById("commentInput");
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const bookList = document.getElementById("bookList");
const webhookUrl =
  "https://chat.googleapis.com/v1/spaces/AAAAi8NZ4oM/messages?key=AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI&token=HZry8VVVzyv-aa-Xl53vnX-b3_EFH8-0l4u1Llp7lrM"; // Webhook URLを指定

let selectBookTitle = "";
let selectBookLink = "";

searchForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // 検索バーに入力されたテキストを取得
  const searchTerm = searchInput.value;

  // Google Books APIのエンドポイントURLを生成
  const apiUrl = `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
    searchTerm
  )}`;

  // APIを呼び出して本の情報を取得
  const response = await fetch(apiUrl);
  const data = await response.json();

  // 検索結果を一覧表示するためのHTMLを生成
  let html = "";
  if (data.items) {
    data.items.forEach((book) => {
      console.log(book);

      const title = book.volumeInfo.title;
      const thumbnail = book.volumeInfo.imageLinks
        ? book.volumeInfo.imageLinks.thumbnail
        : "no-thumbnail.jpg";
      const bookLink = book.volumeInfo.previewLink;

      html += `
        <li class="book-item" onclick="selectBook(this)">
          <p class="book-title">${title}</p>
          <img src="${thumbnail}" alt="Book thumbnail" class="book-thumbnail">
          <button class="previewLinkButton">
            <a target="_blank" href="
            ${bookLink}">詳細</a>
          </button>
        </li>
      `;
    });
  } else {
    html = "<li>検索結果がありません</li>";
  }

  // 一覧表示するためのHTMLを挿入
  bookList.innerHTML = html;

  // 選択中の本のタイトルをリセット
  selectBookTitle = "";
});

function selectBook(bookItem) {
  selectBookTitle = bookItem.children[0].textContent;
  selectBookLink = bookItem.querySelector("a").href;

  let childNum = bookList.childElementCount;
  for (i = 0; i < childNum; i++) {
    bookList.children[i].style.border = "1px solid #fff";
  }

  bookItem.style.border = "1px solid #000000";
}

function clickSubmitButton() {
  // テキストが入力されているかチェック
  if (checkInput()) {
    submitData();
  }
}

function checkInput() {
  if (
    nameInput.value !== "" &&
    selectBookTitle !== "" &&
    commentInput.value !== ""
  ) {
    return true;
  } else {
    alert("名前、オススメポイントの入力、本の選択をしてください。");
    return false;
  }
}

function submitData() {
  const message =
    nameInput.value +
    "さんが「" +
    selectBookTitle +
    "」をオススメしました！\nオススメポイント: " +
    commentInput.value +
    "\n書籍リンク: " +
    selectBookLink; // 投稿するメッセージを指定

  const payload = {
    text: message,
  }; // POSTするデータをJSON形式で指定

  const xhr = new XMLHttpRequest(); // XMLHttpRequestオブジェクトを作成
  xhr.open("POST", webhookUrl, true); // POSTリクエストを作成
  xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8"); // ヘッダーにContent-Typeを指定
  xhr.send(JSON.stringify(payload)); // データを送信

  alert("Google Chatへオススメ本を送信しました。");
}
