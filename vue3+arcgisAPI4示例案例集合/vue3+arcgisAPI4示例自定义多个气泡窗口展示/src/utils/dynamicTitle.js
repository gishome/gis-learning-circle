// import store from '@/store'
import defaultSettings from '@/settings'
import useSettingsStore from '@/store/modules/settings'

/**
 * 动态修改标题
 */
export function useDynamicTitle() {
  const settingsStore = useSettingsStore();
  if (settingsStore.dynamicTitle) {
    // document.title = settingsStore.title + ' - ' + defaultSettings.title;
    document.title = settingsStore.title;
    // 动态设置meta
    // let meta1 = document.createElement('meta');
    // meta1.content = settingsStore.Keywords;
    // meta1.name = "Keywords";
    // document.getElementsByTagName('head')[0].appendChild(meta1);
    // let meta2 = document.createElement('meta');
    // meta2.content = settingsStore.Description;
    // meta2.name = "Description";
    // document.getElementsByTagName('head')[0].appendChild(meta2);
  } else {
    document.title = defaultSettings.title;
  }
}