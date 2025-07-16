import compression from 'vite-plugin-compression'

export default function createCompression(env) {
    const { VITE_BUILD_COMPRESS } = env
    const plugin = []
    if (VITE_BUILD_COMPRESS) {
        const compressList = VITE_BUILD_COMPRESS.split(',')
        if (compressList.includes('gzip')) {
            // http://doc.ruoyi.vip/ruoyi-vue/other/faq.html#使用gzip解压缩静态文件
            plugin.push(
                compression({
                    // ext: '.gz',
                    // deleteOriginFile: false
                    verbose: true, // 默认即可
                    disable: false, // 是否禁用压缩，默认禁用，true为禁用,false为开启，打开压缩需配置nginx支持
                    deleteOriginFile: false, // 删除源文件
                    threshold: 10240, // 压缩前最小文件大小
                    algorithm: "gzip", // 压缩算法
                    ext: ".gz", // 文件类型
            
                })
            )
        }
        if (compressList.includes('brotli')) {
            plugin.push(
                compression({
                    ext: '.br',
                    algorithm: 'brotliCompress',
                    deleteOriginFile: false
                })
            )
        }
    }
    return plugin
}
