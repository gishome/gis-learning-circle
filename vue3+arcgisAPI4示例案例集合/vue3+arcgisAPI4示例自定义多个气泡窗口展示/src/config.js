export const config = {
  mapInitParams: {
    center: [113.50329857, 22.83883628],
    zoom: 5
  }
};

const isMobile = () => {
  let flag = navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)
  return flag;
}
export const getRouterPage = (routerPage) => {
  if (isMobile()) { // 移动端设备
    return routerPage.Mobile;
  } else { // PC端设备
    return routerPage.PC;
  }
}

