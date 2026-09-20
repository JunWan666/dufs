/**
 * @typedef {object} PathItem
 * @property {"Dir"|"SymlinkDir"|"File"|"SymlinkFile"} path_type
 * @property {string} name
 * @property {number} mtime
 * @property {number} size
 */

/**
 * @typedef {object} DATA
 * @property {string} href
 * @property {string} uri_prefix
 * @property {"Index" | "Edit" | "View"} kind
 * @property {PathItem[]} paths
 * @property {boolean} allow_upload
 * @property {boolean} allow_delete
 * @property {boolean} allow_search
 * @property {boolean} allow_archive
 * @property {boolean} auth
 * @property {string} user
 * @property {boolean} dir_exists
 * @property {string} editable
 */

var DUFS_MAX_UPLOADINGS = 1;

/**
 * @type {DATA} DATA
 */
var DATA;

/**
 * @type {string}
 */
var DIR_EMPTY_NOTE;

/**
 * @type {PARAMS}
 * @typedef {object} PARAMS
 * @property {string} q
 * @property {string} sort
 * @property {string} order
 */
const PARAMS = Object.fromEntries(new URLSearchParams(window.location.search).entries());

const LANG_KEY = "dufs_lang";
const AUTH_HEADER_KEY = "dufs_auth_header";
const AUTH_USER_KEY = "dufs_auth_user";
const AUTH_SCOPE = localStorage;

const I18N = {
  "zh-CN": {
    noData: "没有可用数据",
    noResults: "没有找到匹配结果",
    emptyFolder: "这个文件夹是空的",
    uploadToCreate: "上传文件后会自动创建这个文件夹",
    indexTitle: "文件索引",
    editTitle: "编辑",
    viewTitle: "查看",
    fileList: "文件列表",
    readonly: "只读模式",
    readwrite: "可读写",
    guest: "访客",
    login: "登录",
    logout: "退出登录",
    signInTitle: "登录到 Dufs",
    signInDesc: "使用管理员或访客账号继续",
    username: "用户名",
    password: "密码",
    signIn: "登录",
    cancel: "取消",
    close: "关闭",
    authFailed: "用户名或密码不正确",
    signedIn: "已登录",
    signedInAs: "当前用户：",
    signedOut: "已退出登录",
    name: "名称",
    modified: "修改时间",
    size: "大小",
    actions: "操作",
    progress: "进度",
    downloadZip: "打包下载",
    downloadFolder: "下载文件夹为 .zip",
    downloadFile: "下载文件",
    moveRename: "移动或重命名",
    delete: "删除",
    editFile: "编辑文件",
    viewFile: "查看文件",
    copyLink: "复制访问链接",
    copied: "已复制链接",
    copyFailed: "复制失败",
    pathNav: "路径导航",
    back: "后退",
    forward: "前进",
    parentDir: "上一级",
    refresh: "刷新",
    currentPath: "当前路径",
    save: "保存",
    createFolderTitle: "新建文件夹",
    createFolderDesc: "输入文件夹名称，支持多级路径。",
    createFileTitle: "新建文件",
    createFileDesc: "输入文件名称，创建后会进入编辑模式。",
    folderName: "文件夹名称",
    fileName: "文件名称",
    create: "创建",
    deleteTitle: "删除项目",
    deleteDesc: "删除后无法通过 Dufs 撤销，请确认你要继续。",
    deleteConfirm: "删除",
    deleteQuestion: "确定删除",
    moveTitle: "移动或重命名",
    moveDesc: "输入新的绝对路径，例如 /docs/readme.md。",
    newPath: "新路径",
    move: "移动",
    overrideTitle: "覆盖已有文件",
    overrideDesc: "目标路径已经存在，继续会覆盖它。",
    override: "覆盖",
    saveOk: "已保存",
    saveFailed: "保存失败",
    getFileFailed: "获取文件失败",
    downloadFailed: "下载失败",
    deleteFailed: "删除失败",
    moveFailed: "移动失败",
    createFolderFailed: "创建文件夹失败",
    createFileFailed: "创建文件失败",
    retry: "重试",
    uploadDone: "完成",
    uploadFailed: "失败",
    binaryNote: "该文件太大或不是文本文件，无法编辑。",
    searchPlaceholder: "搜索文件或文件夹",
    root: "根目录",
    item: "项",
    items: "项",
    dropUploadTitle: "松开鼠标即可上传",
    dropUploadDesc: "文件将保存到当前目录",
    dropUploadHint: "支持文件与整个文件夹",
  },
  "en-US": {
    noData: "No data",
    noResults: "No results",
    emptyFolder: "Empty folder",
    uploadToCreate: "The folder will be created when a file is uploaded",
    indexTitle: "Index",
    editTitle: "Edit",
    viewTitle: "View",
    fileList: "Files",
    readonly: "Read only",
    readwrite: "Read and write",
    guest: "Guest",
    login: "Sign in",
    logout: "Sign out",
    signInTitle: "Sign in to Dufs",
    signInDesc: "Continue with an admin or guest account",
    username: "Username",
    password: "Password",
    signIn: "Sign in",
    cancel: "Cancel",
    close: "Close",
    authFailed: "Invalid username or password",
    signedIn: "Signed in",
    signedInAs: "Current user: ",
    signedOut: "Signed out",
    name: "Name",
    modified: "Last modified",
    size: "Size",
    actions: "Actions",
    progress: "Progress",
    downloadZip: "Download zip",
    downloadFolder: "Download folder as .zip",
    downloadFile: "Download file",
    moveRename: "Move or rename",
    delete: "Delete",
    editFile: "Edit file",
    viewFile: "View file",
    copyLink: "Copy link",
    copied: "Link copied",
    copyFailed: "Copy failed",
    pathNav: "Path navigation",
    back: "Back",
    forward: "Forward",
    parentDir: "Parent folder",
    refresh: "Refresh",
    currentPath: "Current path",
    save: "Save",
    createFolderTitle: "New folder",
    createFolderDesc: "Enter a folder name. Nested paths are supported.",
    createFileTitle: "New file",
    createFileDesc: "Enter a file name. The editor opens after creation.",
    folderName: "Folder name",
    fileName: "File name",
    create: "Create",
    deleteTitle: "Delete item",
    deleteDesc: "This cannot be undone from Dufs.",
    deleteConfirm: "Delete",
    deleteQuestion: "Delete",
    moveTitle: "Move or rename",
    moveDesc: "Enter a new absolute path, such as /docs/readme.md.",
    newPath: "New path",
    move: "Move",
    overrideTitle: "Overwrite existing file",
    overrideDesc: "The target path already exists.",
    override: "Overwrite",
    saveOk: "Saved",
    saveFailed: "Save failed",
    getFileFailed: "Failed to get file",
    downloadFailed: "Download failed",
    deleteFailed: "Delete failed",
    moveFailed: "Move failed",
    createFolderFailed: "Create folder failed",
    createFileFailed: "Create file failed",
    retry: "Retry",
    uploadDone: "Done",
    uploadFailed: "Failed",
    binaryNote: "Cannot edit because this file is too large or binary.",
    searchPlaceholder: "Search files or folders",
    root: "Root",
    item: "item",
    items: "items",
    dropUploadTitle: "Release to upload",
    dropUploadDesc: "Files will be saved to the current folder",
    dropUploadHint: "Files and folders are supported",
  },
};

let currentLang = localStorage.getItem(LANG_KEY) || "zh-CN";
if (!I18N[currentLang]) currentLang = "zh-CN";

function t(key) {
  return I18N[currentLang][key] || I18N["zh-CN"][key] || key;
}

const IFRAME_FORMATS = [
  ".pdf",
  ".jpg", ".jpeg", ".png", ".gif", ".bmp", ".svg",
  ".mp4", ".mov", ".avi", ".wmv", ".flv", ".webm",
  ".mp3", ".ogg", ".wav", ".m4a",
];

const MAX_SUBPATHS_COUNT = 1000;

const ICONS = {
  dir: `<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM6 4H1V3h5v1z"></path></svg>`,
  symlinkFile: `<svg height="16" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M8.5 1H1c-.55 0-1 .45-1 1v12c0 .55.45 1 1 1h10c.55 0 1-.45 1-1V4.5L8.5 1zM11 14H1V2h7l3 3v9zM6 4.5l4 3-4 3v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73.73-.84 1.69-1.27 2.88-1.27v-2H6z"></path></svg>`,
  symlinkDir: `<svg height="16" viewBox="0 0 14 16" width="14"><path fill-rule="evenodd" d="M13 4H7V3c0-.66-.31-1-1-1H1c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1V5c0-.55-.45-1-1-1zM1 3h5v1H1V3zm6 9v-2c-.98-.02-1.84.22-2.55.7-.71.48-1.19 1.25-1.45 2.3.02-1.64.39-2.88 1.13-3.73C4.86 8.43 5.82 8 7.01 8V6l4 3-4 3H7z"></path></svg>`,
  file: `<svg height="16" viewBox="0 0 12 16" width="12"><path fill-rule="evenodd" d="M6 5H2V4h4v1zM2 8h7V7H2v1zm0 2h7V9H2v1zm0 2h7v-1H2v1zm10-7.5V14c0 .55-.45 1-1 1H1c-.55 0-1-.45-1-1V2c0-.55.45-1 1-1h7.5L12 4.5zM11 5L8 2H1v12h10V5z"></path></svg>`,
  download: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/><path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/></svg>`,
  move: `<svg width="16" height="16" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M1.5 1.5A.5.5 0 0 0 1 2v4.8a2.5 2.5 0 0 0 2.5 2.5h9.793l-3.347 3.346a.5.5 0 0 0 .708.708l4.2-4.2a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708.708L13.293 8.3H3.5A1.5 1.5 0 0 1 2 6.8V2a.5.5 0 0 0-.5-.5z"/></svg>`,
  edit: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207 11.207 2.5zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325z"/></svg>`,
  delete: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.854 7.146a.5.5 0 1 0-.708.708L7.293 9l-1.147 1.146a.5.5 0 0 0 .708.708L8 9.707l1.146 1.147a.5.5 0 0 0 .708-.708L8.707 9l1.147-1.146a.5.5 0 0 0-.708-.708L8 8.293 6.854 7.146z"/><path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z"/></svg>`,
  view: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2zm0 1h8a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1"/></svg>`,
  copy: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M4 2.5A1.5 1.5 0 0 1 5.5 1h7A1.5 1.5 0 0 1 14 2.5v7a1.5 1.5 0 0 1-1.5 1.5H12v1.5A1.5 1.5 0 0 1 10.5 14h-7A1.5 1.5 0 0 1 2 12.5v-7A1.5 1.5 0 0 1 3.5 4H4V2.5zM5 4h5.5A1.5 1.5 0 0 1 12 5.5V10h.5a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7a.5.5 0 0 0-.5.5V4zM3.5 5a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .5.5h7a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.5-.5h-7z"/></svg>`,
  back: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.854 3.146a.5.5 0 0 1 0 .708L3.707 7H13.5a.5.5 0 0 1 0 1H3.707l3.147 3.146a.5.5 0 0 1-.708.708l-4-4a.5.5 0 0 1 0-.708l4-4a.5.5 0 0 1 .708 0z"/></svg>`,
  forward: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M9.146 3.146a.5.5 0 0 0 0 .708L12.293 7H2.5a.5.5 0 0 0 0 1h9.793l-3.147 3.146a.5.5 0 0 0 .708.708l4-4a.5.5 0 0 0 0-.708l-4-4a.5.5 0 0 0-.708 0z"/></svg>`,
  up: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 3.293 3.854 7.439a.5.5 0 1 1-.708-.707l4.5-4.5a.5.5 0 0 1 .708 0l4.5 4.5a.5.5 0 0 1-.708.707L8 3.293z"/><path d="M7.5 3h1v10.5a.5.5 0 0 1-1 0V3z"/></svg>`,
  refresh: `<svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.418A6 6 0 1 1 8 2v1z"/><path d="M8 0a.5.5 0 0 1 .5.5v3A.5.5 0 0 1 8 4H5a.5.5 0 0 1 0-1h2.5V.5A.5.5 0 0 1 8 0z"/></svg>`,
}

/**
 * @type Map<string, Uploader>
 */
const failUploaders = new Map();

/**
 * @type Element
 */
let $pathsTable;
/**
 * @type Element
 */
let $pathsTableHead;
/**
 * @type Element
 */
let $pathsTableBody;
/**
 * @type Element
 */
let $uploadersTable;
/**
 * @type Element
 */
let $emptyFolder;
/**
 * @type Element
 */
let $editor;
/**
 * @type Element
 */
let $loginBtn;
/**
 * @type Element
 */
let $logoutBtn;
/**
 * @type Element
 */
let $userName;
/**
 * @type Element
 */
let $permissionPill;
/**
 * @type HTMLSelectElement
 */
let $languageSelect;

// manage unload event to prevent leaving with uploads in progress
const beforeUnloadHandler = (event) => {
  if (Uploader.queues.length > 0 || Uploader.runnings > 0) {
    event.preventDefault();
    event.returnValue = '';
    return ''; // for some browsers
  }
};

function updateEmptyNote() {
  DIR_EMPTY_NOTE = PARAMS.q
    ? t("noResults")
    : DATA.dir_exists
      ? t("emptyFolder")
      : t("uploadToCreate");
}

function setupLanguage() {
  if (!$languageSelect) return;
  $languageSelect.value = currentLang;
  $languageSelect.addEventListener("change", () => {
    currentLang = $languageSelect.value;
    localStorage.setItem(LANG_KEY, currentLang);
    location.reload();
  });
}

function applyLocale() {
  document.documentElement.lang = currentLang;
  const search = document.getElementById("search");
  if (search) {
    search.placeholder = t("searchPlaceholder");
    search.title = t("searchPlaceholder");
  }
  const fileTitle = document.querySelector(".status-title");
  if (fileTitle) fileTitle.textContent = t("fileList");
  const subtitle = document.querySelector(".status-subtitle");
  if (subtitle) subtitle.textContent = currentLang === "zh-CN" ? "拖拽文件到页面任意位置即可上传" : "Drop files anywhere on the page to upload";
  const localeNote = document.querySelector(".locale-note");
  if (localeNote) localeNote.textContent = currentLang === "zh-CN" ? "默认语言：中文（zh-CN）" : "Default language: Chinese (zh-CN)";
  const loginText = document.querySelector(".login-btn span");
  if (loginText) loginText.textContent = t("login");
  const downloadText = document.querySelector(".download span");
  if (downloadText) downloadText.textContent = t("downloadZip");
  const moveText = document.querySelector(".move-file span");
  if (moveText) moveText.textContent = t("move");
  const deleteText = document.querySelector(".delete-file span");
  if (deleteText) deleteText.textContent = t("delete");
  const uploadText = document.querySelector(".upload-file span");
  if (uploadText) uploadText.textContent = currentLang === "zh-CN" ? "上传" : "Upload";
  const folderText = document.querySelector(".new-folder span");
  if (folderText) folderText.textContent = t("createFolderTitle");
  const fileText = document.querySelector(".new-file span");
  if (fileText) fileText.textContent = t("createFileTitle");
  const saveText = document.querySelector(".save-btn span");
  if (saveText) saveText.textContent = t("save");
  const uploadHeaders = document.querySelectorAll(".uploaders-table th");
  if (uploadHeaders[0]) uploadHeaders[0].textContent = t("name");
  if (uploadHeaders[1]) uploadHeaders[1].textContent = t("progress");
  const pathbar = document.querySelector(".pathbar");
  if (pathbar) pathbar.setAttribute("aria-label", t("pathNav"));
  const pathbarLabel = document.querySelector(".pathbar-label");
  if (pathbarLabel) pathbarLabel.textContent = t("currentPath");
}

function updatePermissionPill() {
  if (!$permissionPill) return;
  const canWrite = DATA.allow_upload || DATA.allow_delete;
  $permissionPill.textContent = canWrite ? t("readwrite") : t("readonly");
  $permissionPill.classList.toggle("can-write", canWrite);
}

function getAuthHeader() {
  return AUTH_SCOPE.getItem(AUTH_HEADER_KEY) || "";
}

function getStoredUser() {
  return AUTH_SCOPE.getItem(AUTH_USER_KEY) || "";
}

function setStoredAuth(user, pass) {
  const raw = `${user}:${pass}`;
  const bytes = new TextEncoder().encode(raw);
  let bin = "";
  bytes.forEach(byte => {
    bin += String.fromCharCode(byte);
  });
  AUTH_SCOPE.setItem(AUTH_HEADER_KEY, `Basic ${btoa(bin)}`);
  AUTH_SCOPE.setItem(AUTH_USER_KEY, user);
}

function clearStoredAuth() {
  AUTH_SCOPE.removeItem(AUTH_HEADER_KEY);
  AUTH_SCOPE.removeItem(AUTH_USER_KEY);
}

function authFetch(input, init = {}) {
  const headers = new Headers(init.headers || {});
  const authHeader = getAuthHeader();
  if (authHeader && !headers.has("Authorization")) {
    headers.set("Authorization", authHeader);
  }
  return fetch(input, { ...init, headers });
}

async function refreshIndexDataFromServer() {
  const url = new URL(location.href);
  url.searchParams.set("json", "");
  const res = await authFetch(url.toString());
  await assertResOK(res);
  DATA = await res.json();
  updateEmptyNote();
}

function showToast(type, title, message = "") {
  const region = document.getElementById("toast-region");
  if (!region) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type || ""}`;
  toast.innerHTML = `
    <div class="toast-title">${encodedStr(title)}</div>
    ${message ? `<div class="toast-message">${encodedStr(message)}</div>` : ""}
  `;
  region.appendChild(toast);
  setTimeout(() => {
    toast.remove();
  }, 3600);
}

function closeDialog() {
  const layer = document.getElementById("dialog-layer");
  if (!layer) return;
  layer.classList.add("hidden");
  layer.setAttribute("aria-hidden", "true");
  layer.innerHTML = "";
}

function dialogShell({ title, desc = "", body = "", actions = "" }) {
  return `
    <div class="dialog-card" role="dialog" aria-modal="true">
      <div class="dialog-head">
        <div>
          <h2 class="dialog-title">${encodedStr(title)}</h2>
          ${desc ? `<p class="dialog-desc">${encodedStr(desc)}</p>` : ""}
        </div>
        <button class="dialog-close" type="button" title="${t("close")}">×</button>
      </div>
      ${body}
      <div class="dialog-actions">${actions}</div>
    </div>
  `;
}

function openInputDialog({ title, desc, label, value = "", confirmText }) {
  const layer = document.getElementById("dialog-layer");
  return new Promise(resolve => {
    layer.innerHTML = dialogShell({
      title,
      desc,
      body: `
        <div class="form-row">
          <label for="dialog-input">${encodedStr(label)}</label>
          <input class="dialog-input" id="dialog-input" type="text">
        </div>
      `,
      actions: `
        <button class="btn" type="button" data-action="cancel">${t("cancel")}</button>
        <button class="btn btn-primary" type="button" data-action="confirm">${encodedStr(confirmText)}</button>
      `,
    });
    const input = layer.querySelector("#dialog-input");
    input.value = value;
    const finish = result => {
      closeDialog();
      resolve(result);
    };
    layer.classList.remove("hidden");
    layer.setAttribute("aria-hidden", "false");
    input.focus();
    input.select();
    layer.querySelector(".dialog-close").addEventListener("click", () => finish(null));
    layer.querySelector("[data-action='cancel']").addEventListener("click", () => finish(null));
    layer.querySelector("[data-action='confirm']").addEventListener("click", () => finish(input.value.trim()));
    input.addEventListener("keydown", event => {
      if (event.key === "Enter") finish(input.value.trim());
      if (event.key === "Escape") finish(null);
    });
  });
}

function openConfirmDialog({ title, desc, detail = "", confirmText, danger = false }) {
  const layer = document.getElementById("dialog-layer");
  return new Promise(resolve => {
    layer.innerHTML = dialogShell({
      title,
      desc,
      body: detail ? `<p class="dialog-desc">${encodedStr(detail)}</p>` : "",
      actions: `
        <button class="btn" type="button" data-action="cancel">${t("cancel")}</button>
        <button class="btn ${danger ? "btn-danger" : "btn-primary"}" type="button" data-action="confirm">${encodedStr(confirmText)}</button>
      `,
    });
    const finish = result => {
      closeDialog();
      resolve(result);
    };
    layer.classList.remove("hidden");
    layer.setAttribute("aria-hidden", "false");
    layer.querySelector(".dialog-close").addEventListener("click", () => finish(false));
    layer.querySelector("[data-action='cancel']").addEventListener("click", () => finish(false));
    layer.querySelector("[data-action='confirm']").addEventListener("click", () => finish(true));
  });
}

function openLoginDialog() {
  const layer = document.getElementById("dialog-layer");
  return new Promise(resolve => {
    layer.innerHTML = dialogShell({
      title: t("signInTitle"),
      desc: t("signInDesc"),
      body: `
        <div class="form-row">
          <label for="login-user">${t("username")}</label>
          <input class="dialog-input" id="login-user" type="text" autocomplete="username">
        </div>
        <div class="form-row">
          <label for="login-pass">${t("password")}</label>
          <input class="dialog-input" id="login-pass" type="password" autocomplete="current-password">
        </div>
        <div class="dialog-error"></div>
      `,
      actions: `
        <button class="btn" type="button" data-action="cancel">${t("cancel")}</button>
        <button class="btn btn-primary" type="button" data-action="confirm">${t("signIn")}</button>
      `,
    });
    const userInput = layer.querySelector("#login-user");
    const passInput = layer.querySelector("#login-pass");
    const error = layer.querySelector(".dialog-error");
    const confirm = layer.querySelector("[data-action='confirm']");
    const finish = result => {
      closeDialog();
      resolve(result);
    };
    const submit = async () => {
      const user = userInput.value.trim();
      const pass = passInput.value;
      if (!user || !pass) {
        error.textContent = t("authFailed");
        return;
      }
      confirm.disabled = true;
      error.textContent = "";
      setStoredAuth(user, pass);
      try {
        await checkAuth("login", { prompt: false });
        showToast("success", t("signedIn"), `${t("signedInAs")}${user}`);
        finish(true);
        // 从游客目录（/public）登录管理员时回到根目录，否则原地刷新
        if (DATA.href === "/public/" || DATA.href.startsWith("/public/")) {
          location.href = dufsEndpoint("");
        } else {
          location.reload();
        }
      } catch {
        clearStoredAuth();
        error.textContent = t("authFailed");
        confirm.disabled = false;
      }
    };
    layer.classList.remove("hidden");
    layer.setAttribute("aria-hidden", "false");
    userInput.value = getStoredUser();
    userInput.focus();
    layer.querySelector(".dialog-close").addEventListener("click", () => finish(false));
    layer.querySelector("[data-action='cancel']").addEventListener("click", () => finish(false));
    confirm.addEventListener("click", submit);
    [userInput, passInput].forEach(input => {
      input.addEventListener("keydown", event => {
        if (event.key === "Enter") submit();
        if (event.key === "Escape") finish(false);
      });
    });
  });
}

// Produce table when window loads
window.addEventListener("DOMContentLoaded", async () => {
  const $indexData = document.getElementById('index-data');
  if (!$indexData) {
    showToast("error", t("noData"));
    return;
  }

  DATA = JSON.parse(decodeBase64($indexData.innerHTML));
  if (getAuthHeader() && DATA.kind === "Index") {
    try {
      await refreshIndexDataFromServer();
    } catch {
      clearStoredAuth();
    }
  }
  updateEmptyNote();

  await ready();
});

window.addEventListener("pageshow", event => {
  if (event.persisted && getAuthHeader() && DATA?.auth && !DATA.user) {
    location.reload();
  }
});

async function ready() {
  $pathsTable = document.querySelector(".paths-table");
  $pathsTableHead = document.querySelector(".paths-table thead");
  $pathsTableBody = document.querySelector(".paths-table tbody");
  $uploadersTable = document.querySelector(".uploaders-table");
  $emptyFolder = document.querySelector(".empty-folder");
  $editor = document.querySelector(".editor");
  $loginBtn = document.querySelector(".login-btn");
  $logoutBtn = document.querySelector(".logout-btn");
  $userName = document.querySelector(".user-name");
  $permissionPill = document.querySelector(".permission-pill");
  $languageSelect = document.querySelector(".language-select");

  window.addEventListener('beforeunload', beforeUnloadHandler);

  setupLanguage();
  applyLocale();
  document.body.dataset.kind = DATA.kind.toLowerCase();
  const brand = document.querySelector(".brand-mark");
  if (brand) brand.href = DATA.uri_prefix || "/";
  addBreadcrumb(DATA.href, DATA.uri_prefix);
  updatePermissionPill();
  if (DATA.auth) {
    await setupAuth();
  }
  if (getAuthHeader() && DATA.auth) {
    try {
      await checkAuth(undefined, { prompt: false });
    } catch {
      clearStoredAuth();
      if (DATA.kind === "Index" && !DATA.user) {
        $loginBtn.classList.remove("hidden");
      }
    }
  }

  if (DATA.kind === "Index") {
    document.title = `${t("indexTitle")} ${DATA.href} - Dufs`;
    document.querySelector(".index-page").classList.remove("hidden");

    await setupIndexPage();
  } else if (DATA.kind === "Settings") {
    setupSettingsPage();
  } else if (DATA.kind === "Edit") {
    document.title = `${t("editTitle")} ${DATA.href} - Dufs`;
    document.querySelector(".editor-page").classList.remove("hidden");

    await setupEditorPage();
  } else if (DATA.kind === "View") {
    document.title = `${t("viewTitle")} ${DATA.href} - Dufs`;
    document.querySelector(".editor-page").classList.remove("hidden");

    await setupEditorPage();
  }
}

class Uploader {
  /**
   *
   * @param {File} file
   * @param {string[]} pathParts
   */
  constructor(file, pathParts) {
    /**
     * @type Element
     */
    this.$uploadStatus = null
    this.uploaded = 0;
    this.uploadOffset = 0;
    this.lastUptime = 0;
    this.name = [...pathParts, file.name].join("/");
    this.idx = Uploader.globalIdx++;
    this.file = file;
    this.url = newUrl(this.name);
  }

  upload() {
    const { idx, name, url } = this;
    const encodedName = encodedStr(name);
    $uploadersTable.insertAdjacentHTML("beforeend", `
  <tr id="upload${idx}" class="uploader">
    <td class="path cell-icon">
      ${getPathSvg()}
    </td>
    <td class="path cell-name">
      <a href="${url}">${encodedName}</a>
    </td>
    <td class="cell-status upload-status" id="uploadStatus${idx}"></td>
  </tr>`);
    $uploadersTable.classList.remove("hidden");
    $emptyFolder.classList.add("hidden");
    this.$uploadStatus = document.getElementById(`uploadStatus${idx}`);
    this.$uploadStatus.innerHTML = '-';
    this.$uploadStatus.addEventListener("click", e => {
      const nodeId = e.target.id;
      const matches = /^retry(\d+)$/.exec(nodeId);
      if (matches) {
        const id = parseInt(matches[1]);
        let uploader = failUploaders.get(id);
        if (uploader) uploader.retry();
      }
    });
    Uploader.queues.push(this);
    Uploader.runQueue();
  }

  ajax() {
    const { url } = this;

    this.uploaded = 0;
    this.lastUptime = Date.now();

    const ajax = new XMLHttpRequest();
    ajax.upload.addEventListener("progress", e => this.progress(e), false);
    ajax.addEventListener("readystatechange", () => {
      if (ajax.readyState === 4) {
        if (ajax.status >= 200 && ajax.status < 300) {
          this.complete();
        } else {
          if (ajax.status != 0) {
            this.fail(`${ajax.status} ${ajax.statusText}`);
          }
        }
      }
    })
    ajax.addEventListener("error", () => this.fail(), false);
    ajax.addEventListener("abort", () => this.fail(), false);
    if (this.uploadOffset > 0) {
      ajax.open("PATCH", url);
      ajax.setRequestHeader("X-Update-Range", "append");
      if (getAuthHeader()) ajax.setRequestHeader("Authorization", getAuthHeader());
      ajax.send(this.file.slice(this.uploadOffset));
    } else {
      ajax.open("PUT", url);
      if (getAuthHeader()) ajax.setRequestHeader("Authorization", getAuthHeader());
      ajax.send(this.file);
      // setTimeout(() => ajax.abort(), 3000);
    }
  }

  async retry() {
    const { url } = this;
    let res = await authFetch(url, {
      method: "HEAD",
    });
    let uploadOffset = 0;
    if (res.status == 200) {
      let value = res.headers.get("content-length");
      uploadOffset = parseInt(value) || 0;
    }
    this.uploadOffset = uploadOffset;
    this.ajax();
  }

  progress(event) {
    const now = Date.now();
    const elapsed = now - this.lastUptime;
    if (elapsed < 300) return; // throttle update for safari
    const speed = (event.loaded - this.uploaded) / elapsed * 1000;
    const [speedValue, speedUnit] = formatFileSize(speed);
    const speedText = `${speedValue} ${speedUnit}/s`;
    const progress = formatPercent(((event.loaded + this.uploadOffset) / this.file.size) * 100);
    const duration = formatDuration((event.total - event.loaded) / speed);
    this.$uploadStatus.innerHTML = `<span style="width: 80px;">${speedText}</span><span style="margin-left: 5px;">${progress} ${duration}</span>`;
    this.uploaded = event.loaded;
    this.lastUptime = now;
  }

  complete() {
    const $uploadStatusNew = this.$uploadStatus.cloneNode(true);
    $uploadStatusNew.innerHTML = `<span class="upload-ok" title="${t("uploadDone")}">✓</span>`;
    this.$uploadStatus.parentNode.replaceChild($uploadStatusNew, this.$uploadStatus);
    this.$uploadStatus = null;
    failUploaders.delete(this.idx);
    Uploader.runnings--;
    Uploader.runQueue();
  }

  fail(reason = "") {
    this.$uploadStatus.innerHTML = `<span style="width: 20px;" title="${encodedStr(reason || t("uploadFailed"))}">✗</span><span class="retry-btn" id="retry${this.idx}" title="${t("retry")}">↻</span>`;
    failUploaders.set(this.idx, this);
    Uploader.runnings--;
    Uploader.runQueue();
  }
}

Uploader.globalIdx = 0;

Uploader.runnings = 0;

Uploader.auth = false;

/**
 * @type Uploader[]
 */
Uploader.queues = [];


Uploader.runQueue = async () => {
  if (Uploader.runnings >= DUFS_MAX_UPLOADINGS) return;
  if (Uploader.queues.length == 0) return;
  Uploader.runnings++;
  let uploader = Uploader.queues.shift();
  if (!Uploader.auth) {
    Uploader.auth = true;
    try {
      await checkAuth();
    } catch {
      Uploader.auth = false;
      uploader.fail(t("authFailed"));
      return;
    }
  }
  uploader.ajax();
}

/**
 * Add breadcrumb
 * @param {string} href
 * @param {string} uri_prefix
 */
function addBreadcrumb(href, uri_prefix) {
  const $breadcrumb = document.querySelector(".breadcrumb");
  let parts = [];
  if (href === "/") {
    parts = [""];
  } else {
    parts = href.split("/");
  }
  const len = parts.length;
  let path = uri_prefix;
  for (let i = 0; i < len; i++) {
    const name = parts[i];
    if (i > 0) {
      if (!path.endsWith("/")) {
        path += "/";
      }
      path += encodeURIComponent(name);
    }
    const encodedName = encodedStr(name);
    if (i === 0) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<a href="${path}" title="${t("root")}"><svg width="16" height="16" viewBox="0 0 16 16"><path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5z"/></svg></a>`);
    } else if (i === len - 1) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<b>${encodedName}</b>`);
    } else {
      $breadcrumb.insertAdjacentHTML("beforeend", `<a href="${path}">${encodedName}</a>`);
    }
    if (i !== len - 1) {
      $breadcrumb.insertAdjacentHTML("beforeend", `<span class="separator">/</span>`);
    }
  }
}

async function setupIndexPage() {
  if (DATA.allow_archive) {
    const $download = document.querySelector(".download");
    $download.href = baseUrl() + "?zip";
    $download.title = t("downloadFolder");
    $download.classList.add("dlwt");
    $download.classList.remove("hidden");
  }

  if (DATA.allow_upload) {
    setupDropzone();
    setupUploadFile();
    setupNewFolder();
    setupNewFile();
  }

  if (DATA.allow_upload && !DATA.auth) {
    setupAdminSetupBanner();
  }

  // 「仅公开目录」模式：未登录访客打开根路径时引导到公开目录
  // （已登录用户不受影响，因为这里用的是浏览器里真实保存的登录态）
  if (!DATA.user && DATA.public_only && DATA.href === "/") {
    location.replace(dufsEndpoint("public/"));
    return;
  }

  updatePermissionPill();

  if (DATA.allow_search) {
    setupSearch();
  }

  renderPathsTableHead();
  renderPathsTableBody();
  setupPathBar();

  if (DATA.user) {
    setupDownloadWithToken();
  }
}

function setupPathBar() {
  const pathbar = document.querySelector(".pathbar");
  if (!pathbar) return;
  const back = pathbar.querySelector(".history-back");
  const forward = pathbar.querySelector(".history-forward");
  const parent = pathbar.querySelector(".parent-dir");
  const refresh = pathbar.querySelector(".refresh-dir");
  const crumbs = pathbar.querySelector(".pathbar-crumbs");
  const parts = currentPathParts();

  back.innerHTML = `${ICONS.back}<span>${t("back")}</span>`;
  forward.innerHTML = `${ICONS.forward}<span>${t("forward")}</span>`;
  parent.innerHTML = `${ICONS.up}<span>${t("parentDir")}</span>`;
  refresh.innerHTML = `${ICONS.refresh}<span>${t("refresh")}</span>`;
  back.title = t("back");
  forward.title = t("forward");
  parent.title = t("parentDir");
  refresh.title = t("refresh");
  back.addEventListener("click", () => history.back());
  forward.addEventListener("click", () => history.forward());
  refresh.addEventListener("click", () => location.reload());

  if (parts.length === 0) {
    parent.disabled = true;
  } else {
    parent.addEventListener("click", () => {
      location.href = urlForPathParts(parts.slice(0, -1));
    });
  }

  crumbs.innerHTML = [
    `<a href="${urlForPathParts([])}">${t("root")}</a>`,
    ...parts.map((part, index) => {
      const label = encodedStr(part);
      const href = urlForPathParts(parts.slice(0, index + 1));
      const isLast = index === parts.length - 1;
      return `<span class="pathbar-separator">›</span>${isLast ? `<b>${label}</b>` : `<a href="${href}" title="${t("pathNav")}: ${label}">${label}</a>`}`;
    }),
  ].join("");
  pathbar.classList.remove("hidden");
}

/**
 * Render path table thead
 */
function renderPathsTableHead() {
  const headerItems = [
    {
      name: "name",
      props: `colspan="2"`,
      text: t("name"),
    },
    {
      name: "mtime",
      props: ``,
      text: t("modified"),
    },
    {
      name: "size",
      props: ``,
      text: t("size"),
    }
  ];
  $pathsTableHead.insertAdjacentHTML("beforeend", `
    <tr>
      ${headerItems.map(item => {
    let svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5zm-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5z"/></svg>`;
    let order = "desc";
    if (PARAMS.sort === item.name) {
      if (PARAMS.order === "desc") {
        order = "asc";
        svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z"/></svg>`
      } else {
        svg = `<svg width="12" height="12" viewBox="0 0 16 16"><path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5z"/></svg>`
      }
    }
    const qs = new URLSearchParams({ ...PARAMS, order, sort: item.name }).toString();
    const icon = `<span>${svg}</span>`
    return `<th class="cell-${item.name}" ${item.props}><a href="?${qs}">${item.text}${icon}</a></th>`
  }).join("\n")}
      <th class="cell-actions">${t("actions")}</th>
    </tr>
  `);
}

/**
 * Render path table tbody
 */
function renderPathsTableBody() {
  if (DATA.paths && DATA.paths.length > 0) {
    const len = DATA.paths.length;
    if (len > 0) {
      $pathsTable.classList.remove("hidden");
    }
    for (let i = 0; i < len; i++) {
      addPath(DATA.paths[i], i);
    }
  } else {
    $emptyFolder.textContent = DIR_EMPTY_NOTE;
    $emptyFolder.classList.remove("hidden");
  }
}

/**
 * Add pathitem
 * @param {PathItem} file
 * @param {number} index
 */
function addPath(file, index) {
  const encodedName = encodedStr(file.name);
  let url = newUrl(file.name);
  let actionDelete = "";
  let actionDownload = "";
  let actionMove = "";
  let actionEdit = "";
  let actionView = "";
  const actionCopy = `<button onclick="copyPathLink(${index})" class="action-btn" type="button" title="${t("copyLink")}">${ICONS.copy}</button>`;
  let isDir = file.path_type.endsWith("Dir");
  if (isDir) {
    url += "/";
    if (DATA.allow_archive) {
      actionDownload = `
      <div class="action-btn">
        <a class="dlwt" href="${url}?zip" title="${t("downloadFolder")}" download>${ICONS.download}</a>
      </div>`;
    }
  } else {
    actionDownload = `
    <div class="action-btn" >
      <a class="dlwt" href="${url}" title="${t("downloadFile")}" download>${ICONS.download}</a>
    </div>`;
  }
  if (DATA.allow_delete) {
    if (DATA.allow_upload) {
      actionMove = `<div onclick="movePath(${index})" class="action-btn" id="moveBtn${index}" title="${t("moveRename")}">${ICONS.move}</div>`;
      if (!isDir) {
        actionEdit = `<a class="action-btn" title="${t("editFile")}" target="_blank" href="${url}?edit">${ICONS.edit}</a>`;
      }
    }
    actionDelete = `
    <div onclick="deletePath(${index})" class="action-btn" id="deleteBtn${index}" title="${t("delete")}">${ICONS.delete}</div>`;
  }
  if (!actionEdit && !isDir) {
    actionView = `<a class="action-btn" title="${t("viewFile")}" target="_blank" href="${url}?view">${ICONS.view}</a>`;
  }
  let actionCell = `
  <td class="cell-actions">
    ${actionDownload}
    ${actionCopy}
    ${actionView}
    ${actionMove}
    ${actionDelete}
    ${actionEdit}
  </td>`;

  let sizeDisplay = isDir ? formatDirSize(file.size) : formatFileSize(file.size).join(" ");

  const isPublicDir = isDir && file.name === "public";
  $pathsTableBody.insertAdjacentHTML("beforeend", `
<tr id="addPath${index}"${isPublicDir ? ' class="public-dir-row"' : ""}>
  <td class="path cell-icon">
    ${getPathSvg(file.path_type)}
  </td>
  <td class="path cell-name">
    <div class="name-line">
      <a href="${url}" ${isDir ? "" : `target="_blank"`}>${encodedName}</a>${isPublicDir ? '<span class="public-tag">访客可见</span>' : ""}
    </div>
  </td>
  <td class="cell-mtime">${formatMtime(file.mtime)}</td>
  <td class="cell-size">${sizeDisplay}</td>
  ${actionCell}
</tr>`);
}

/** 统一构造后端管理接口地址（不受当前所在目录影响） */
function dufsEndpoint(relPath) {
  const prefix = DATA.uri_prefix || "/";
  return new URL(
    prefix.replace(/\/?$/, "/") + String(relPath).replace(/^\//, ""),
    location.origin
  ).toString();
}

/** 账号抽屉菜单：修改密码 / 设置 / 退出登录 */
function setupUserMenu() {
  const menu = document.getElementById("user-menu");
  if (!menu) return;

  const initial = (DATA.user || "?").slice(0, 1).toUpperCase();
  const $menuAvatar = document.querySelector(".user-menu-avatar");
  if ($menuAvatar) $menuAvatar.textContent = initial;
  const $menuName = document.querySelector(".user-menu-name");
  if ($menuName) $menuName.textContent = DATA.user || "";

  const closeMenu = () => menu.classList.add("hidden");

  $logoutBtn.addEventListener("click", event => {
    event.stopPropagation();
    menu.classList.toggle("hidden");
  });
  menu.addEventListener("click", event => event.stopPropagation());
  document.addEventListener("click", closeMenu);
  document.addEventListener("keydown", event => {
    if (event.key === "Escape") closeMenu();
  });

  const bind = (action, handler) => {
    const el = menu.querySelector(`[data-action='${action}']`);
    if (el) {
      el.addEventListener("click", () => {
        closeMenu();
        handler();
      });
    }
  };
  bind("password", openPasswordDialog);
  bind("settings", openSettingsPage);
  bind("logout", logout);
}

/** 工具栏「设置」按钮：跳转到独立的设置页 */
function setupSettingsButton() {
  const btn = document.querySelector(".settings-btn");
  if (!btn) return;
  btn.classList.remove("hidden");
  btn.addEventListener("click", openSettingsPage);
}

/** 打开独立的设置页（带 URL，可刷新、可后退） */
function openSettingsPage() {
  location.href = baseUrl() + "?settings";
}

function scopeLabel(scope) {
  if (scope === "public") return "仅公开目录";
  if (scope === "none") return "完全禁止";
  return "全站只读";
}

/** 独立的设置页：访客访问权限 / 公开目录 / 账号 / 服务信息 */
async function setupSettingsPage() {
  const page = document.getElementById("settings-page");
  if (!page) return;
  document.querySelector(".index-page").classList.add("hidden");
  page.classList.remove("hidden");

  const scope = DATA.anonymous_scope || "all";
  const allowDirect = DATA.allow_direct_file_access !== false;
  const endpoint = dufsEndpoint("__dufs__/admin/settings");

  const option = (value, title, desc) => `
    <label class="settings-option">
      <input type="radio" name="scope" value="${value}" ${scope === value ? "checked" : ""}>
      <div class="settings-option-text">
        <strong>${title}</strong>
        <span>${desc}</span>
      </div>
    </label>`;

  page.innerHTML = `
    <div class="settings-wrap">
      <nav class="settings-crumbs" aria-label="面包屑">
        <a href="${dufsEndpoint("")}">首页</a>
        <span class="crumbs-sep">/</span>
        <span class="crumbs-current">设置</span>
      </nav>

      <div class="settings-layout">
        <aside class="settings-nav" aria-label="设置菜单">
          <button class="settings-nav-item active" type="button" data-panel="access">访客访问权限</button>
          <button class="settings-nav-item" type="button" data-panel="public">公开目录</button>
          <button class="settings-nav-item" type="button" data-panel="account">账号</button>
          <button class="settings-nav-item" type="button" data-panel="about">服务信息</button>
        </aside>

        <div class="settings-panels">
          <section class="settings-panel" data-panel="access">
            <h2>访客访问权限</h2>
            <p class="settings-desc">未登录的访客可以访问的范围，修改后立即生效。</p>
            <div class="settings-options">
              ${option("all", "全站只读", "所有文件都能被浏览和下载")}
              ${option("public", "仅公开目录 /public（推荐）", "访客只能看到公开目录里的内容，其他文件完全不可见")}
              ${option("none", "完全禁止", "任何文件都必须登录后才能访问")}
            </div>
            <label class="settings-toggle">
              <input type="checkbox" id="direct-file-access" ${allowDirect ? "checked" : ""}>
              <div class="settings-option-text">
                <strong>允许通过完整链接直接访问文件</strong>
                <span>开启后：知道完整文件链接的人可以直接打开（仍无法浏览目录）</span>
              </div>
            </label>
          </section>

          <section class="settings-panel hidden" data-panel="public">
            <h2>公开目录</h2>
            <p class="settings-desc">把要分享给访客的文件放进 <code>/public</code>，访客无需登录即可浏览和下载。</p>
            <div class="settings-actions">
              <button class="btn btn-primary" type="button" id="create-public">一键创建公开目录</button>
              <span class="settings-status" id="public-status"></span>
            </div>
          </section>

          <section class="settings-panel hidden" data-panel="account">
            <h2>账号</h2>
            <p class="settings-desc">当前账号：<b>${encodedStr(DATA.user || "admin")}</b></p>
            <div class="settings-actions">
              <button class="btn" type="button" id="open-password">修改密码</button>
            </div>
          </section>

          <section class="settings-panel hidden" data-panel="about">
            <h2>服务信息</h2>
            <ul class="settings-meta">
              <li>服务目录：<code>${encodedStr(DATA.serve_path || "-")}</code></li>
              <li>版本：${encodedStr(DATA.version || "-")}</li>
              <li>当前访客状态：<b>${scopeLabel(scope)}</b>${allowDirect && scope === "public" ? "（可直链访问文件）" : ""}</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  `;

  // 左侧菜单切换
  page.querySelectorAll(".settings-nav-item").forEach(item => {
    item.addEventListener("click", () => {
      page.querySelectorAll(".settings-nav-item").forEach(el => {
        el.classList.toggle("active", el === item);
      });
      page.querySelectorAll(".settings-panel").forEach(panel => {
        panel.classList.toggle("hidden", panel.dataset.panel !== item.dataset.panel);
      });
    });
  });

  async function saveSettings(message) {
    const checked = page.querySelector("input[name='scope']:checked");
    const $direct = document.getElementById("direct-file-access");
    try {
      const res = await authFetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymous_scope: checked ? checked.value : "all",
          allow_direct_file_access: $direct ? $direct.checked : true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      showToast("success", "已保存", message || "设置已立即生效");
    } catch (err) {
      showToast("error", "保存失败", err.message || "");
    }
  }

  page.querySelectorAll("input[name='scope']").forEach(radio => {
    radio.addEventListener("change", () => {
      if (!radio.checked) return;
      saveSettings(
        radio.value === "public"
          ? "访客现在只能看到 /public 目录"
          : "访客访问范围已更新"
      );
    });
  });

  const $direct = document.getElementById("direct-file-access");
  if ($direct) {
    $direct.addEventListener("change", () => {
      saveSettings("直链访问已" + ($direct.checked ? "开启" : "关闭"));
    });
  }

  const $status = document.getElementById("public-status");
  const readme = [
    "这是公开目录",
    "============",
    "",
    "· 访客无需登录即可浏览和下载本目录里的文件",
    "· 请把需要分享给他人的文件放到这里",
    "· 其他目录只有管理员登录后才能访问",
    "",
    "（本说明由 Dufs 自动创建，可以自由修改或删除）",
  ].join("\n");

  document.getElementById("create-public").addEventListener("click", async () => {
    $status.textContent = "正在检查…";
    try {
      const headRes = await authFetch(dufsEndpoint("public/README.txt"), { method: "HEAD" });
      if (headRes.ok) {
        $status.textContent = "公开目录已存在 ✅";
        return;
      }
      const res = await authFetch(dufsEndpoint("public/README.txt"), {
        method: "PUT",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: readme,
      });
      if (!res.ok && res.status !== 201 && res.status !== 204) {
        throw new Error(`HTTP ${res.status}`);
      }
      $status.textContent = "已创建 ✅";
      showToast("success", "公开目录已创建", "/public/README.txt 已写入说明");
    } catch (err) {
      $status.textContent = "创建失败：" + (err.message || "未知错误");
    }
  });

  document.getElementById("open-password").addEventListener("click", openPasswordDialog);
}

/** 旧版设置对话框（已被独立设置页取代，保留但不再入口调用） */
async function openSettingsDialogLegacy() {
  const layer = document.getElementById("dialog-layer");
  layer.innerHTML = dialogShell({
    title: "设置",
    desc: "访客访问权限与账号管理",
    body: `<div class="settings-body" id="settings-body"><p class="settings-hint">正在读取设置…</p></div>`,
    actions: `<button class="btn" type="button" data-action="close">关闭</button>`,
  });
  layer.classList.remove("hidden");
  layer.setAttribute("aria-hidden", "false");
  const finish = () => closeDialog();
  layer.querySelector(".dialog-close").addEventListener("click", finish);
  layer.querySelector("[data-action='close']").addEventListener("click", finish);
  layer.addEventListener("keydown", event => {
    if (event.key === "Escape") finish();
  });

  const $body = document.getElementById("settings-body");
  const endpoint = dufsEndpoint("__dufs__/admin/settings");

  let settings;
  try {
    const res = await authFetch(endpoint);
    if (!res.ok) {
      throw new Error(
        res.status === 403 ? "该账号由启动参数或配置文件提供，网页无法修改设置" : `HTTP ${res.status}`
      );
    }
    settings = await res.json();
  } catch (err) {
    $body.innerHTML = `<p class="settings-error">读取设置失败：${encodedStr(err.message || "未知错误")}</p>`;
    return;
  }

  $body.innerHTML = `
    <section class="settings-section">
      <h3 class="settings-title">访客访问权限</h3>
      <p class="settings-hint">未登录的访客可以访问的范围（修改后立即生效）：</p>
      <label class="settings-radio"><input type="radio" name="scope" value="all"><span>全站只读 —— 所有文件都能被浏览和下载</span></label>
      <label class="settings-radio"><input type="radio" name="scope" value="public"><span>仅公开目录 <code>/public</code>（推荐）</span></label>
      <label class="settings-radio"><input type="radio" name="scope" value="none"><span>完全禁止 —— 访客必须登录才能访问</span></label>
      <label class="settings-check">
        <input type="checkbox" id="direct-file-access">
        <span>允许通过完整链接直接访问文件（仅「仅公开目录」模式生效）</span>
      </label>
      <p class="settings-hint">开启后：知道完整文件链接的人可以直接打开，但仍无法浏览目录；关闭后：任何文件都必须登录才能访问。</p>
      <div class="settings-row">
        <button class="btn btn-primary" type="button" id="create-public">一键创建公开目录</button>
        <span class="settings-status" id="public-status"></span>
      </div>
      <p class="settings-hint">创建后会在 <code>/public</code> 里写入一份说明文件，游客和管理员都能一眼看懂这个目录的用途。</p>
    </section>
    <section class="settings-section">
      <h3 class="settings-title">账号</h3>
      <p class="settings-hint">当前账号：<b>${encodedStr(settings.user || "admin")}</b></p>
      <button class="btn" type="button" id="open-password">修改密码</button>
    </section>
    <section class="settings-section">
      <h3 class="settings-title">服务信息</h3>
      <ul class="settings-meta">
        <li>服务目录：<code>${encodedStr(settings.serve_path || "-")}</code></li>
        <li>版本：${encodedStr(settings.version || "-")}</li>
        <li>界面语言：${currentLang === "zh-CN" ? "中文" : "English"}</li>
      </ul>
    </section>
  `;

  // 回填当前范围与直链开关
  const radios = $body.querySelectorAll("input[name='scope']");
  const $direct = document.getElementById("direct-file-access");
  if ($direct) $direct.checked = settings.allow_direct_file_access !== false;

  async function saveSettings() {
    const scope = (document.querySelector("input[name='scope']:checked") || {}).value || "all";
    try {
      const res = await authFetch(endpoint, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          anonymous_scope: scope,
          allow_direct_file_access: $direct ? $direct.checked : true,
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const detail =
        scope === "public"
          ? "访客只能看到 /public 目录" + ($direct && !$direct.checked ? "，且不能用直链绕开" : "")
          : "访客访问范围已更新";
      showToast("success", "已保存", detail);
    } catch (err) {
      showToast("error", "保存失败", err.message || "");
    }
  }

  radios.forEach(radio => {
    if (radio.value === (settings.anonymous_scope || "all")) radio.checked = true;
    radio.addEventListener("change", () => {
      if (radio.checked) saveSettings();
    });
  });
  if ($direct) $direct.addEventListener("change", saveSettings);

  document.getElementById("open-password").addEventListener("click", () => {
    closeDialog();
    openPasswordDialog();
  });

  const $status = document.getElementById("public-status");
  const readme = [
    "这是公开目录",
    "============",
    "",
    "· 访客无需登录即可浏览和下载本目录里的文件",
    "· 请把需要分享给他人的文件放到这里",
    "· 其他目录只有管理员登录后才能访问",
    "",
    "（本说明由 Dufs 自动创建，可以自由修改或删除）",
  ].join("\n");

  document.getElementById("create-public").addEventListener("click", async () => {
    $status.textContent = "正在检查…";
    try {
      const headRes = await authFetch(dufsEndpoint("public/README.txt"), { method: "HEAD" });
      if (headRes.ok) {
        $status.textContent = "公开目录已存在 ✅";
        return;
      }
      const res = await authFetch(dufsEndpoint("public/README.txt"), {
        method: "PUT",
        headers: { "Content-Type": "text/plain; charset=utf-8" },
        body: readme,
      });
      if (!res.ok && res.status !== 201 && res.status !== 204) {
        throw new Error(`HTTP ${res.status}`);
      }
      $status.textContent = "已创建 ✅";
      showToast("success", "公开目录已创建", "/public/README.txt 已写入说明");
    } catch (err) {
      $status.textContent = "创建失败：" + (err.message || "未知错误");
    }
  });
}

/** 修改当前账号密码（写入数据目录，立即生效） */
function openPasswordDialog() {
  const layer = document.getElementById("dialog-layer");
  layer.innerHTML = dialogShell({
    title: "修改密码",
    desc: `当前账号：${DATA.user || "admin"}。密码保存在数据目录中，修改后立即生效。`,
    body: `
      <div class="form-row">
        <label for="pwd-new">新密码</label>
        <input class="dialog-input" id="pwd-new" type="password" placeholder="至少 4 位" autocomplete="new-password">
      </div>
      <div class="form-row">
        <label for="pwd-confirm">确认新密码</label>
        <input class="dialog-input" id="pwd-confirm" type="password" placeholder="再输入一次" autocomplete="new-password">
      </div>
      <p class="setup-note" id="pwd-note"></p>
    `,
    actions: `
      <button class="btn" type="button" data-action="cancel">取消</button>
      <button class="btn btn-primary" type="button" data-action="confirm">保存</button>
    `,
  });

  const $new = layer.querySelector("#pwd-new");
  const $confirm = layer.querySelector("#pwd-confirm");
  const $note = layer.querySelector("#pwd-note");
  const finish = () => closeDialog();

  async function submit() {
    const password = $new.value;
    if (password.length < 4) {
      $note.textContent = "密码至少 4 位";
      return;
    }
    if (password !== $confirm.value) {
      $note.textContent = "两次输入的密码不一致";
      return;
    }
    $note.textContent = "正在保存…";
    try {
      const res = await authFetch(dufsEndpoint("__dufs__/admin"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) {
        if (res.status === 403) {
          throw new Error("该账号由启动参数或配置文件提供，请在服务器侧修改");
        }
        throw new Error((await res.text()) || `${res.status}`);
      }
      closeDialog();
      showToast("success", "密码已更新", "下次访问请使用新密码登录");
      setTimeout(() => location.reload(), 1800);
    } catch (err) {
      $note.textContent = "修改失败：" + (err.message || "未知错误");
    }
  }

  layer.classList.remove("hidden");
  layer.setAttribute("aria-hidden", "false");
  $new.focus();
  layer.querySelector(".dialog-close").addEventListener("click", finish);
  layer.querySelector("[data-action='cancel']").addEventListener("click", finish);
  layer.querySelector("[data-action='confirm']").addEventListener("click", submit);
  $confirm.addEventListener("keydown", e => {
    if (e.key === "Enter") submit();
  });
  layer.addEventListener("keydown", e => {
    if (e.key === "Escape") finish();
  });
}

/** 未配置任何账号时，提示初始化管理员密码 */
function setupAdminSetupBanner() {
  const banner = document.getElementById("admin-banner");
  if (!banner) return;
  banner.classList.remove("hidden");
  const action = banner.querySelector(".admin-banner-action");
  if (action) action.addEventListener("click", openAdminSetupDialog);
}

/** 首次初始化：设置管理员账号（写入数据目录后立即生效，无需重启） */
function openAdminSetupDialog() {
  const layer = document.getElementById("dialog-layer");
  layer.innerHTML = dialogShell({
    title: "设置管理员账号",
    desc: "设置后需要登录才能上传、修改和删除文件；保存立即生效，无需重启容器。",
    body: `
      <div class="form-row">
        <label for="setup-user">用户名</label>
        <input class="dialog-input" id="setup-user" type="text" value="admin" autocomplete="off">
      </div>
      <div class="form-row">
        <label for="setup-pass">密码</label>
        <input class="dialog-input" id="setup-pass" type="password" placeholder="至少 4 位" autocomplete="new-password">
      </div>
      <label class="setup-check">
        <input type="checkbox" id="setup-anon" checked>
        <span>允许访客免登录只读浏览（取消后所有人都必须登录才能访问）</span>
      </label>
      <p class="setup-note" id="setup-note"></p>
    `,
    actions: `
      <button class="btn" type="button" data-action="cancel">稍后再说</button>
      <button class="btn btn-primary" type="button" data-action="confirm">保存并启用</button>
    `,
  });

  const $user = layer.querySelector("#setup-user");
  const $pass = layer.querySelector("#setup-pass");
  const $anon = layer.querySelector("#setup-anon");
  const $note = layer.querySelector("#setup-note");
  const finish = () => closeDialog();

  async function submit() {
    const user = $user.value.trim();
    const password = $pass.value;
    if (!user) {
      $note.textContent = "请填写用户名";
      return;
    }
    if (password.length < 4) {
      $note.textContent = "密码至少 4 位";
      return;
    }
    $note.textContent = "正在保存…";
    try {
      const res = await fetch(dufsEndpoint("__dufs__/admin"), {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user, password, allow_anonymous_read: $anon.checked }),
      });
      if (!res.ok) {
        throw new Error((await res.text()) || `${res.status}`);
      }
      closeDialog();
      showToast("success", "管理员账号已设置", "请使用刚设置的账号登录");
      setTimeout(() => location.reload(), 1600);
    } catch (err) {
      $note.textContent = "设置失败：" + (err.message || "未知错误");
    }
  }

  layer.classList.remove("hidden");
  layer.setAttribute("aria-hidden", "false");
  $user.focus();
  layer.querySelector(".dialog-close").addEventListener("click", finish);
  layer.querySelector("[data-action='cancel']").addEventListener("click", finish);
  layer.querySelector("[data-action='confirm']").addEventListener("click", submit);
  $pass.addEventListener("keydown", e => {
    if (e.key === "Enter") submit();
  });
  layer.addEventListener("keydown", e => {
    if (e.key === "Escape") finish();
  });
}

function setupDropzone() {
  ["drag", "dragstart", "dragend", "dragover", "dragenter", "dragleave", "drop"].forEach(name => {
    document.addEventListener(name, e => {
      e.preventDefault();
      e.stopPropagation();
    });
  });

  const overlay = document.getElementById("drop-overlay");
  if (!overlay) return;

  const $overlayPath = document.getElementById("drop-overlay-path");
  document.getElementById("drop-overlay-title").textContent = t("dropUploadTitle");
  document.getElementById("drop-overlay-desc").textContent = t("dropUploadDesc");
  document.getElementById("drop-overlay-hint").textContent = t("dropUploadHint");
  $overlayPath.textContent = decodeURIComponent(DATA.href || "/");

  let dragDepth = 0;

  function isFileDrag(e) {
    const dt = e.dataTransfer;
    if (!dt) return false;
    if (dt.types && Array.from(dt.types).indexOf("Files") !== -1) return true;
    if (dt.items && dt.items.length && dt.items[0].kind === "file") return true;
    return false;
  }

  function showOverlay() {
    overlay.classList.remove("hidden");
    overlay.setAttribute("aria-hidden", "false");
  }

  function hideOverlay() {
    overlay.classList.add("hidden");
    overlay.setAttribute("aria-hidden", "true");
  }

  document.addEventListener("dragenter", e => {
    if (!isFileDrag(e)) return;
    dragDepth += 1;
    showOverlay();
  });

  document.addEventListener("dragover", e => {
    if (!isFileDrag(e)) return;
    if (e.dataTransfer) e.dataTransfer.dropEffect = "copy";
    if (overlay.classList.contains("hidden")) showOverlay();
  });

  document.addEventListener("dragleave", e => {
    dragDepth = Math.max(0, dragDepth - 1);
    if (dragDepth === 0 || !e.relatedTarget) {
      dragDepth = 0;
      hideOverlay();
    }
  });

  document.addEventListener("dragend", () => {
    dragDepth = 0;
    hideOverlay();
  });

  document.addEventListener("drop", async e => {
    dragDepth = 0;
    hideOverlay();
    if (!e.dataTransfer) return;
    if (!e.dataTransfer.items[0] || !e.dataTransfer.items[0].webkitGetAsEntry) {
      const files = Array.from(e.dataTransfer.files).filter(v => v.size > 0);
      for (const file of files) {
        new Uploader(file, []).upload();
      }
    } else {
      const items = e.dataTransfer.items;
      const entries = [];
      for (let i = 0; i < items.length; i++) {
        const entry = items[i].webkitGetAsEntry && items[i].webkitGetAsEntry();
        if (entry) entries.push(entry);
      }
      if (entries.length) {
        addFileEntries(entries, []);
      } else {
        // 个别浏览器/场景下拿不到 entry，退回普通文件上传，避免静默失败
        const files = Array.from(e.dataTransfer.files).filter(v => v.size > 0);
        for (const file of files) {
          new Uploader(file, []).upload();
        }
      }
    }
  });
}

async function setupAuth() {
  if (DATA.user) {
    $logoutBtn.classList.remove("hidden");
    $userName.textContent = DATA.user;
    const avatar = document.querySelector(".user-avatar");
    if (avatar) avatar.textContent = DATA.user.slice(0, 1).toUpperCase();
    setupUserMenu();
    setupSettingsButton();
  } else {
    $loginBtn.classList.remove("hidden");
    $loginBtn.addEventListener("click", () => openLoginDialog());
  }
}

function setupDownloadWithToken() {
  document.querySelectorAll("a.dlwt").forEach(link => {
    link.addEventListener("click", async e => {
      e.preventDefault();
      try {
        const link = e.currentTarget || e.target;
        const originalHref = link.getAttribute("href");
        const tokengenUrl = new URL(originalHref, location.href);
        tokengenUrl.searchParams.set("tokengen", "");
        const res = await authFetch(tokengenUrl);
        if (!res.ok) throw new Error(t("downloadFailed"));
        const token = await res.text();
        const downloadUrl = new URL(originalHref, location.href);
        downloadUrl.searchParams.set("token", token);
        const tempA = document.createElement("a");
        tempA.href = downloadUrl.toString();
        tempA.download = "";
        document.body.appendChild(tempA);
        tempA.click();
        document.body.removeChild(tempA);
      } catch (err) {
        showToast("error", t("downloadFailed"), err.message);
      }
    });
  });
}

function setupSearch() {
  const $searchbar = document.querySelector(".searchbar");
  $searchbar.classList.remove("hidden");
  $searchbar.addEventListener("submit", event => {
    event.preventDefault();
    const formData = new FormData($searchbar);
    const q = formData.get("q");
    let href = baseUrl();
    if (q) {
      href += "?q=" + q;
    }
    location.href = href;
  });
  if (PARAMS.q) {
    document.getElementById('search').value = PARAMS.q;
  }
}

function setupUploadFile() {
  document.querySelector(".upload-file").classList.remove("hidden");
  document.getElementById("file").addEventListener("change", async e => {
    const files = e.target.files;
    for (let file of files) {
      new Uploader(file, []).upload();
    }
  });
}

function setupNewFolder() {
  const $newFolder = document.querySelector(".new-folder");
  $newFolder.classList.remove("hidden");
  $newFolder.addEventListener("click", async () => {
    const name = await openInputDialog({
      title: t("createFolderTitle"),
      desc: t("createFolderDesc"),
      label: t("folderName"),
      confirmText: t("create"),
    });
    if (name) createFolder(name);
  });
}

function setupNewFile() {
  const $newFile = document.querySelector(".new-file");
  $newFile.classList.remove("hidden");
  $newFile.addEventListener("click", async () => {
    const name = await openInputDialog({
      title: t("createFileTitle"),
      desc: t("createFileDesc"),
      label: t("fileName"),
      confirmText: t("create"),
    });
    if (name) createFile(name);
  });
}

async function setupEditorPage() {
  const url = baseUrl();
  const $toolbox = document.querySelector(".toolbox");

  const $download = document.querySelector(".download");
  $download.classList.remove("hidden");
  $download.href = url;
  $download.title = t("downloadFile");
  const downloadText = $download.querySelector("span");
  if (downloadText) downloadText.textContent = t("downloadFile");

  if (DATA.kind == "Edit") {
    const $moveFile = document.querySelector(".move-file");
    $moveFile.classList.remove("hidden");
    $moveFile.addEventListener("click", async () => {
      const query = location.href.slice(url.length);
      const newFileUrl = await doMovePath(url);
      if (newFileUrl) {
        location.href = newFileUrl + query;
      }
    });

    const $deleteFile = document.querySelector(".delete-file");
    $deleteFile.classList.remove("hidden");
    $deleteFile.addEventListener("click", async () => {
      const url = baseUrl();
      const name = baseName(url);
      await doDeletePath(name, url, () => {
        location.href = location.href.split("/").slice(0, -1).join("/");
      });
    });

    if (DATA.editable) {
      const $saveBtn = document.querySelector(".save-btn");
      if ($toolbox) {
        $toolbox.insertBefore($saveBtn, $toolbox.firstElementChild);
      }
      $saveBtn.classList.add("primary", "editor-save");
      $saveBtn.classList.remove("hidden");
      $saveBtn.addEventListener("click", saveChange);
    }
  } else if (DATA.kind == "View") {
    $editor.readonly = true;
  }

  if (!DATA.editable) {
    const $notEditable = document.querySelector(".not-editable");
    const url = baseUrl();
    const ext = extName(baseName(url));
    if (IFRAME_FORMATS.find(v => v === ext)) {
      $notEditable.insertAdjacentHTML("afterend", `<iframe src="${url}" sandbox width="100%" height="${window.innerHeight - 100}px"></iframe>`);
    } else {
      $notEditable.classList.remove("hidden");
      $notEditable.textContent = t("binaryNote");
    }
    return;
  }

  $editor.classList.remove("hidden");
  try {
    const res = await authFetch(baseUrl());
    await assertResOK(res);
    const encoding = getEncoding(res.headers.get("content-type"));
    if (encoding === "utf-8") {
      $editor.value = await res.text();
    } else {
      const bytes = await res.arrayBuffer();
      const dataView = new DataView(bytes);
      const decoder = new TextDecoder(encoding);
      $editor.value = decoder.decode(dataView);
    }
  } catch (err) {
    showToast("error", t("getFileFailed"), err.message);
  }
}

/**
 * Delete path
 * @param {number} index
 * @returns
 */
async function deletePath(index) {
  const file = DATA.paths[index];
  if (!file) return;
  await doDeletePath(file.name, newUrl(file.name), () => {
    document.getElementById(`addPath${index}`)?.remove();
    DATA.paths[index] = null;
    if (!DATA.paths.find(v => !!v)) {
      $pathsTable.classList.add("hidden");
      $emptyFolder.textContent = DIR_EMPTY_NOTE;
      $emptyFolder.classList.remove("hidden");
    }
  });
}

async function doDeletePath(name, url, cb) {
  const ok = await openConfirmDialog({
    title: t("deleteTitle"),
    desc: t("deleteDesc"),
    detail: `${t("deleteQuestion")} "${name}"?`,
    confirmText: t("deleteConfirm"),
    danger: true,
  });
  if (!ok) return;
  try {
    await checkAuth();
    const res = await authFetch(url, {
      method: "DELETE",
    });
    await assertResOK(res);
    cb();
  } catch (err) {
    showToast("error", t("deleteFailed"), `${name}: ${err.message}`);
  }
}

/**
 * Move path
 * @param {number} index
 * @returns
 */
async function movePath(index) {
  const file = DATA.paths[index];
  if (!file) return;
  const fileUrl = newUrl(file.name);
  const newFileUrl = await doMovePath(fileUrl);
  if (newFileUrl) {
    location.href = newFileUrl.split("/").slice(0, -1).join("/");
  }
}

async function copyPathLink(index) {
  const file = DATA.paths[index];
  if (!file) return;
  let url = newUrl(file.name);
  if (file.path_type.endsWith("Dir")) url += "/";
  const absoluteUrl = new URL(url, location.href).toString();
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(absoluteUrl);
    } else {
      const input = document.createElement("input");
      input.value = absoluteUrl;
      input.style.position = "fixed";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      input.remove();
    }
    showToast("success", t("copied"), absoluteUrl);
  } catch (err) {
    showToast("error", t("copyFailed"), err.message);
  }
}

async function doMovePath(fileUrl) {
  const fileUrlObj = new URL(fileUrl);

  const prefix = DATA.uri_prefix.slice(0, -1);

  const filePath = decodeURIComponent(fileUrlObj.pathname.slice(prefix.length));

  let newPath = await openInputDialog({
    title: t("moveTitle"),
    desc: t("moveDesc"),
    label: t("newPath"),
    value: filePath,
    confirmText: t("move"),
  });
  if (!newPath) return;
  if (!newPath.startsWith("/")) newPath = "/" + newPath;
  if (filePath === newPath) return;
  const newFileUrl = fileUrlObj.origin + prefix + newPath.split("/").map(encodeURIComponent).join("/");

  try {
    await checkAuth();
    const res1 = await authFetch(newFileUrl, {
      method: "HEAD",
    });
    if (res1.status === 200) {
      const ok = await openConfirmDialog({
        title: t("overrideTitle"),
        desc: t("overrideDesc"),
        detail: newPath,
        confirmText: t("override"),
        danger: true,
      });
      if (!ok) {
        return;
      }
    }
    const res2 = await authFetch(fileUrl, {
      method: "MOVE",
      headers: {
        "Destination": newFileUrl,
      }
    });
    await assertResOK(res2);
    return newFileUrl;
  } catch (err) {
    showToast("error", t("moveFailed"), `${filePath} -> ${newPath}: ${err.message}`);
  }
}


/**
 * Save editor change
 */
async function saveChange() {
  try {
    await checkAuth();
    const res = await authFetch(baseUrl(), {
      method: "PUT",
      body: $editor.value,
    });
    await assertResOK(res);
    showToast("success", t("saveOk"));
    location.reload();
  } catch (err) {
    showToast("error", t("saveFailed"), err.message);
  }
}

async function checkAuth(variant, options = {}) {
  if (!DATA.auth) return;
  if (!getAuthHeader() && options.prompt !== false) {
    const ok = await openLoginDialog();
    if (!ok) throw new Error(t("authFailed"));
    return;
  }
  const qs = variant ? `?${variant}` : "";
  const res = await authFetch(baseUrl() + qs, {
    method: "CHECKAUTH",
  });
  await assertResOK(res);
  $loginBtn.classList.add("hidden");
  $logoutBtn.classList.remove("hidden");
  const user = await res.text();
  $userName.textContent = user || getStoredUser();
  const avatar = document.querySelector(".user-avatar");
  if (avatar) avatar.textContent = ($userName.textContent || t("guest")).slice(0, 1).toUpperCase();
}

async function logout() {
  if (!DATA.auth) return;
  try {
    // 通知服务端清除会话 Cookie，否则浏览器直接导航时仍会被视为已登录
    await authFetch(baseUrl(), { method: "LOGOUT" });
  } catch (err) {
    // 忽略：即使失败也继续清理本地状态
  }
  clearStoredAuth();
  showToast("success", t("signedOut"));
  location.href = baseUrl();
}

/**
 * Create a folder
 * @param {string} name
 */
async function createFolder(name) {
  const url = newUrl(name);
  try {
    await checkAuth();
    const res = await authFetch(url, {
      method: "MKCOL",
    });
    await assertResOK(res);
    location.href = url;
  } catch (err) {
    showToast("error", t("createFolderFailed"), `${name}: ${err.message}`);
  }
}

async function createFile(name) {
  const url = newUrl(name);
  try {
    await checkAuth();
    const res = await authFetch(url, {
      method: "PUT",
      body: "",
    });
    await assertResOK(res);
    location.href = url + "?edit";
  } catch (err) {
    showToast("error", t("createFileFailed"), `${name}: ${err.message}`);
  }
}

async function addFileEntries(entries, dirs) {
  for (const entry of entries) {
    if (entry.isFile) {
      entry.file(file => {
        new Uploader(file, dirs).upload();
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();

      const successCallback = entries => {
        if (entries.length > 0) {
          addFileEntries(entries, [...dirs, entry.name]);
          dirReader.readEntries(successCallback);
        }
      };

      dirReader.readEntries(successCallback);
    }
  }
}


function newUrl(name) {
  let url = baseUrl();
  if (!url.endsWith("/")) url += "/";
  url += name.split("/").map(encodeURIComponent).join("/");
  return url;
}

function baseUrl() {
  return location.href.split(/[?#]/)[0];
}

function currentPathParts() {
  return DATA.href === "/"
    ? []
    : DATA.href.split("/").filter(Boolean);
}

function urlForPathParts(parts) {
  const prefix = DATA.uri_prefix || "/";
  let url = prefix.endsWith("/") ? prefix : `${prefix}/`;
  if (parts.length > 0) {
    url += parts.map(encodeURIComponent).join("/");
    url += "/";
  }
  return url;
}

function baseName(url) {
  return decodeURIComponent(url.split("/").filter(v => v.length > 0).slice(-1)[0]);
}

function extName(filename) {
  const dotIndex = filename.lastIndexOf('.');

  if (dotIndex === -1 || dotIndex === 0 || dotIndex === filename.length - 1) {
    return '';
  }

  return filename.substring(dotIndex);
}

function getPathSvg(path_type) {
  switch (path_type) {
    case "Dir":
      return ICONS.dir;
    case "SymlinkFile":
      return ICONS.symlinkFile;
    case "SymlinkDir":
      return ICONS.symlinkDir;
    default:
      return ICONS.file;
  }
}

function formatMtime(mtime) {
  if (!mtime) return "";
  const date = new Date(mtime);
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1, 2);
  const day = padZero(date.getDate(), 2);
  const hours = padZero(date.getHours(), 2);
  const minutes = padZero(date.getMinutes(), 2);
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

function padZero(value, size) {
  return ("0".repeat(size) + value).slice(-1 * size);
}

function formatDirSize(size) {
  const unit = size === 1 ? t("item") : t("items");
  const num = size >= MAX_SUBPATHS_COUNT ? `>${MAX_SUBPATHS_COUNT - 1}` : `${size}`;
  return ` ${num} ${unit}`;
}

function formatFileSize(size) {
  if (size == null) return [0, "B"];
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  if (size == 0) return [0, "B"];
  const i = parseInt(Math.floor(Math.log(size) / Math.log(1024)));
  const raw = size / Math.pow(1024, i);
  let value;
  if (i > 0 && raw < 999.95) {
    value = Math.round(raw * 10) / 10;
  } else {
    value = Math.round(raw);
  }
  return [value, sizes[i]];
}

function formatDuration(seconds) {
  seconds = Math.ceil(seconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds - h * 3600) / 60);
  const s = seconds - h * 3600 - m * 60;
  return `${padZero(h, 2)}:${padZero(m, 2)}:${padZero(s, 2)}`;
}

function formatPercent(percent) {
  if (percent > 10) {
    return percent.toFixed(1) + "%";
  } else {
    return percent.toFixed(2) + "%";
  }
}

function encodedStr(rawStr) {
  return rawStr.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
    return '&#' + i.charCodeAt(0) + ';';
  });
}

async function assertResOK(res) {
  if (!(res.status >= 200 && res.status < 300)) {
    throw new Error(await res.text() || `Invalid status ${res.status}`);
  }
}

function getEncoding(contentType) {
  const charset = contentType?.split(";")[1];
  if (/charset/i.test(charset)) {
    let encoding = charset.split("=")[1];
    if (encoding) {
      return encoding.toLowerCase();
    }
  }
  return 'utf-8';
}

// Parsing base64 strings with Unicode characters
function decodeBase64(base64String) {
  const binString = atob(base64String);
  const len = binString.length;
  const bytes = new Uint8Array(len);
  const arr = new Uint32Array(bytes.buffer, 0, Math.floor(len / 4));
  let i = 0;
  for (; i < arr.length; i++) {
    arr[i] = binString.charCodeAt(i * 4) |
      (binString.charCodeAt(i * 4 + 1) << 8) |
      (binString.charCodeAt(i * 4 + 2) << 16) |
      (binString.charCodeAt(i * 4 + 3) << 24);
  }
  for (i = i * 4; i < len; i++) {
    bytes[i] = binString.charCodeAt(i);
  }
  return new TextDecoder().decode(bytes);
}
