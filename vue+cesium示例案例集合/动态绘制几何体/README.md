## 项目技术栈
- 前端：Vue3 + Vite + CesiumJS

## 项目运行环境
- Node.js v16+

## 项目初始化
```
npm install
```
## 运行项目
```
npm run dev
npm run build
npm run preview
```
## 项目说明
1. 项目中使用了CesiumJS的自定义着色器功能，通过修改顶点和片元着色器的方式实现了对CesiumJS的自定义着色器功能的使用。
```
        const customShaders = new Cesium.CustomShader({
            // 用户想要添加到着色器的任何自定义uniform。
            //Uniform是一种在着色器程序中定义的全局变量，它们可以在着色器程序的任何地方使用，但它们的值在每个渲染周期中都是不变的。
            // 这些可以在运行时通过以下方式 更改 customShader.setUniform()
            uniforms: {
                u_time: {
                    value: 0, // 初始值
                    type: Cesium.UniformType.FLOAT
                },
                // Textures can be loaded from a URL, a Resource, or a TypedArray.//纹理可以从 URL、资源或类型数组加载
                // 有关更多详细信息，请参阅Uniforms部分
                u_externalTexture: {
                    value: new Cesium.TextureUniform({
                        url: "http://example.com/image.png"
                    }),
                    type: Cesium.UniformType.SAMPLER_2D
                },
                // 将出现在自定义顶点和片段着色器文本中的自定义变化。
                varyings: {
                    v_customTexCoords: Cesium.VaryingType.VEC2
                },
                // configure where in the fragment shader's materials/lighting pipeline the custom shader goes. More on this below.
                //配置自定义着色器在片段着色器的材质/光照管线中的位置。更多内容见下文。
                mode: Cesium.CustomShaderMode.MODIFY_MATERIAL,
                // either PBR (physically-based rendering) or UNLIT depending on the desired results.
                //PBR（基于物理的渲染）或 UNLIT，具体取决于所需的结果。
                lightingModel: Cesium.LightingModel.PBR,
                // Force the shader to render as transparent, even if the primitive had an opaque material
                //强制着色器渲染为透明，即使基元具有不透明材质
                translucencyMode: Cesium.CustomShaderTranslucencyMode.TRANSLUCENT,
                // Custom vertex shader. This is a function from model space -> model space.VertexInput is documented below
                // 自定义顶点着色器。这是模型空间 ->模型空间的函数.VertexInput输入记录如下
                vertexShaderText: `
                    // IMPORTANT: the function signature must use these parameter names. This
                    // makes it easier for the runtime to generate the shader and make optimizations.
                    //重要说明：函数签名必须使用这些参数名称。这使运行时更容易生成着色器并进行优化。
                    void vertexMain(VertexInput vsInput, inout czm_modelVertexOutput vsOutput) {
                        // code goes here. An empty body is a no-op.
                        //代码在这里……空的内容是无操作的。
                    }
                `,
                // Custom fragment shader.
                // FragmentInput will be documented below
                // Regardless of the mode, this always takes in a material and modifies it in place.
                //自定义片元着色器
                //FragmentInput（片元）输入将被记录在下面 
                //无论模式如何，这里需要一个material（材质）并将其modifies（位置）放到位                                           
                fragmentShaderText: `
                    // IMPORTANT: the function signature must use these parameter names. This
                    // makes it easier for the runtime to generate the shader and make optimizations.
                    // 重要提示：函数签名必须使用这些参数名称。这
                    // 使运行时更容易生成着色器并进行优化。
                    void fragmentMain(FragmentInput fsInput, inout czm_modelMaterial material) {
                        // code goes here. e.g. to set the diffuse color to a translucent red:
                        //代码在这里。例如将漫反射颜色设置为半透明的红色：
                        material.diffuse = vec3(1.0, 0.0, 0.0);
                        material.alpha = 0.5;
                    }
                `,
            }
        });
``` 


