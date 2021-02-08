const applicationKey = 'YOUR_APPLICATION_KEY';
const clientKey = 'YOUR_CLIENT_KEY';
const ncmb = new NCMB(applicationKey, clientKey);

ons.ready(async () => {
  let user = ncmb.User.getCurrentUser();
  if (user) {
    try {
      await ncmb.DataStore('Test').fetch();
    } catch (e) {
      user = null;
    }
  }
  if (!user) {
    user = await ncmb.User.loginAsAnonymous();
  }
  const role = await ncmb.Role.equalTo('roleName', 'admin').fetch();
  const users = await role.fetchUser();
  window.admin = users.map(u => u.objectId).indexOf(user.objectId) > -1;
})

function loadImage(name, className) {
  if (!this.querySelector(className)) return;
  ncmb.File.download(name, 'blob')
    .then(blob => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.querySelector(className).src = fileReader.result;
      }
      fileReader.readAsDataURL(blob) ;
    })
}

// 削除可能か判定する関数
function deletable(obj) {
  let bol = false;
  // 管理者であれば常に削除可能
  if (window.admin) {
    bol = true;
  } else {
    // 管理者でない場合は自分に削除権限があるかチェック
    const user = ncmb.User.getCurrentUser();
    bol = user && obj.acl[user.objectId] && obj.acl[user.objectId].write;
  }
  // 削除可能な場合はゴミ箱アイコンを表示
  return bol ? `<ons-icon data-object-id="${obj.objectId}" class="delete" icon="fa-trash"></ons-icon>` : '';
}
