/*
 * @Author: Nokey 
 * @Date: 2017-07-13 18:03:17 
 * @Last Modified by: Mr.B
 * @Last Modified time: 2018-03-11 17:09:40
 */
'use strict';

import config from '../../../config'
// import setWxShare from '../../modules/utils/share'

// polyfills
import 'babel-polyfill'

// Plugins
import { TimelineLite } from 'gsap'

// Style
import '../../fonts/roboto-light.styl'
import '../../styles/common.styl'
import './css'

// modules
import { manifest } from './manifest'

(function ($, win) {
    /**
     * Public Parameters
     */
    let _win = $(win),
        _win_height = _win.height(),
        _win_width = _win.width(),
        _ua = win.navigator.userAgent.toLowerCase(),
        _isMac = /macintosh|mac os x/.test(_ua),
        _isIphone = /iphone/.test(_ua),
        _isIpad = /ipad/.test(_ua),
        _isAndroid = /android|adr|linux/.test(_ua),
        _isMobile = /mobile|android|kindle|silk|midp|phone|(windows .+arm|touch)/.test(_ua),
        tap_event_name = _isMobile ? 'touchend' : 'click'

    // code from here
    let stage = new createjs.Stage('roomCanvas'),
        stage_w = $('#roomCanvas').attr('width'),
        stage_h = $('#roomCanvas').attr('height')
        // circle = new createjs.Shape()

    createjs.Ticker.setFPS(60)
    createjs.Ticker.addEventListener('tick', stage)

    // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50)
    // circle.x = 100
    // circle.y = 100
    // stage.addChild(circle)

    class Scene1{
        constructor(props){
            this.bg = null

            this.cont = {
                scene: new createjs.Container(),
                mask: new createjs.Container(),
                drawer: new createjs.Container()
            }

            this.m = new createjs.Shape(new createjs.Graphics().dr(0,0,500,500)).set({
                x: 300,
                y: 300
            })

            this.hammer = {
                active: false
            }

            this.glasses = {
                active: false
            }

            this.grandpa_get_glasses = false

            this.envelope = null
        }

        init(data){
            let _me = this

            // _me.cont.scene.mask = _me.m
            stage.addChild(_me.cont.scene)
            stage.addChild(_me.cont.drawer)
            stage.addChild(_me.cont.mask)

            return _me
        }

        show(){
            let _me = this


            return _me
        }

        hide(){
            let _me = this


            return _me
        }

        addBg(img){
            let _me = this

            _me.bg = new createjs.Bitmap(img)
            _me.bg.name = 'bg'

            // _me.bg.mask = _me.m

            _me.cont.scene.addChild(this.bg)

            return _me
        }

        addCabinet(img){
            let _me = this,
                cabinet

            cabinet = new createjs.Bitmap(img)
            cabinet.name = 'cabinet'
            cabinet.x = 396
            cabinet.y = 1090
            // cabinet.on('click', (e)=>{
            //     _me.showMask()
            // })

            _me.cont.scene.addChild(cabinet)

            return _me
        }

        addDrawer(img){
            let _me = this,
                drawer,
                isOpen = false

            _me.cont.drawer.x = 454
            _me.cont.drawer.y = 1083

            let m = new createjs.Shape(new createjs.Graphics().dr(0,0,254,500)).set({
                x: 454,
                y: 1173
            })
            _me.cont.drawer.mask = m

            drawer = new createjs.Bitmap(img)
            drawer.name = 'drawer'
            drawer.on('click', (e)=>{
                createjs.Sound.play('sound_drawer')
                if(!isOpen){
                    createjs.Tween.get(_me.cont.drawer)
                        .to({y: 1173}, 1000, createjs.Ease.getPowInOut(4))
                        .call(()=>{
                            isOpen = true
                        })
                }else{
                    createjs.Tween.get(_me.cont.drawer)
                        .to({y: 1083}, 1000, createjs.Ease.getPowInOut(4))
                        .call(()=>{
                            isOpen = false
                        })
                }
            })

            _me.cont.drawer.addChild(drawer)

            return _me
        }

        addHammer(img, img2){
            let _me = this,
                hammer,
                isPicked = false

            hammer = new createjs.Bitmap(img)
            hammer.name = 'hammer'
            hammer.x = 70
            hammer.y = 10
            hammer.on('click', (e)=>{
                console.log('picked')
                // _me.addHammerToPack(img2, ()=>{
                //     _me.cont.drawer.removeChild(_me.cont.drawer.getChildByName('hammer'))
                // })
                BACKPACK.add({
                    name: 'hammer',
                    img: img2,
                    cb: ()=>{
                        _me.cont.drawer.removeChild(_me.cont.drawer.getChildByName('hammer'))
                    }
                })
            })

            _me.cont.drawer.addChild(hammer)
            
            return _me
        }

        addGlasses(img){
            let _me = this,
                glasses

            glasses = new createjs.Bitmap(img)
            glasses.name = 'glasses'
            glasses.x = 447
            glasses.y = 566
            glasses.on('click', (e)=>{
                console.log('picked')
                // _me.addGlassesPack(img, ()=>{
                //     _me.cont.scene.removeChild(_me.cont.scene.getChildByName('glasses'))
                // })
                BACKPACK.add({
                    name: 'glasses',
                    img: img,
                    cb: ()=>{
                        _me.cont.scene.removeChild(_me.cont.scene.getChildByName('glasses'))
                    }
                })
            })

            _me.cont.scene.addChild(glasses)

            return _me
        }

        addMural(img){
            let _me = this,
                mural

            mural = new createjs.Bitmap(img)
            mural.name = 'mural'
            mural.x = 398
            mural.y = 335
            mural.rotation = 0
            mural.on('click', (e)=>{
                console.log('picked')
                if(BACKPACK.boxs['hammer_pack'] && BACKPACK.boxs['hammer_pack'].active){
                    createjs.Sound.play('sound_mural')
                    createjs.Tween.get(mural)
                        .to({
                            // rotation: -30,
                            y: 1090
                        }, 300)
                        .call(()=>{
                            // mural.rotation = -30
                        })
                }
            })

            _me.cont.scene.addChild(mural)

            return _me
        }

        addBell(img){
            let _me = this,
                bell,
                cont = new createjs.Container(),
                droped = false

            cont.x = 1250
            cont.y = 600

            bell = new createjs.Bitmap(img)
            bell.name = 'bell'
            // bell.x = -1 * bell.getBounds().width / 2
            bell.x = -17
            bell.y = 0
            bell.scale = 2
            cont.rotation = 0
            bell.on('click', (e)=>{
                createjs.Sound.play('sound_bell')
                console.log('bell')
                createjs.Tween.get(cont)
                        .to({
                            rotation: -30,
                        }, 150)
                        .to({
                            rotation: 30,
                        }, 300)
                        .to({
                            rotation: 0,
                        }, 150)
                        .call(()=>{
                            cont.rotation = 0
                        })
                
                if(!droped){
                    droped = true

                    createjs.Tween.get(_me.envelope)
                        .to({
                            rotation: 0,
                            y: 1543
                        }, 800)
                        .call(()=>{
                            _me.envelope.rotation = 0
                            on_door = false
                        })
                }
            })

            cont.addChild(bell)

            _me.cont.scene.addChild(cont)

            return _me
        }

        addGrandpa(img, img2){
            let _me = this,
                grandpa

            grandpa = new createjs.Bitmap(img)
            grandpa.name = 'grandpa'
            grandpa.x = 852
            grandpa.y = 916
            grandpa.on('click', (e)=>{
                console.log('picked')
                if(BACKPACK.boxs['glasses_pack'] && BACKPACK.boxs['glasses_pack'].active){
                    _me.addGrandpaGlasses(img2, ()=>{
                        _me.cont.scene.removeChild(_me.cont.scene.getChildByName('grandpa'))

                        BACKPACK.remove({
                            name: 'glasses'
                        })
                    })
                }
            })

            _me.cont.scene.addChild(grandpa)

            return _me
        }

        addGrandpaGlasses(img, cb){
            let _me = this,
                grandpa_glasses

            grandpa_glasses = new createjs.Bitmap(img)
            grandpa_glasses.name = 'grandpa_glasses'
            grandpa_glasses.x = 852
            grandpa_glasses.y = 916

            _me.cont.scene.addChild(grandpa_glasses)

            _me.grandpa_get_glasses = true

            createjs.Sound.play('sound_grandpa')

            cb && cb()

            return _me
        }

        addEnvelope(img, img2){
            let _me = this,
                cont = new createjs.Container(),
                envelope,
                on_door = true

            let m = new createjs.Shape(new createjs.Graphics().dr(0,0,2480,2480)).set({
                x: 0,
                y: 1055
            })
            
            _me.envelope = new createjs.Bitmap(img)
            _me.envelope.name = 'envelope'
            _me.envelope.x = 1550
            _me.envelope.y = 940
            _me.envelope.rotation = 35
            _me.envelope.mask = m
            _me.envelope.on('click', (e)=>{
                if(_me.grandpa_get_glasses){
                    _me.showEnvelopeMask(img2)
                }
            })

            _me.cont.scene.addChild(_me.envelope)

            return _me
        }

        showEnvelopeMask(img){
            let _me = this,
                mask = new createjs.Shape(),
                envelope_open

            mask.graphics.beginFill('rgba(0,0,0,0.8)').drawRect(0, 0, stage_w, stage_h)
            mask.name = 'mask'
            mask.on('click', (e)=>{
                console.log('mask', mask.name)
                _me.cont.mask.removeChild(_me.cont.mask.getChildByName('mask'))
                _me.cont.mask.removeChild(_me.cont.mask.getChildByName('envelope_open'))
                stage.update()
            })

            envelope_open = new createjs.Bitmap(img)
            envelope_open.name = 'envelope_open'
            envelope_open.x = 612
            envelope_open.y = 353

            _me.cont.mask.addChild(mask, envelope_open)

            stage.update()
        }

        render(){
            stage.update()
        }
    }

    class Backpack{
        constructor(props) {
            this.scene1 = props.scene1
            this.active_item = ''
            this.boxs = {}
        }

        add(obj){
            let _me = this

            createjs.Sound.play('sound_pack')

            switch (obj.name) {
                case 'hammer':
                    _me.addHammer(obj)
                    break;

                case 'glasses':
                    _me.addGlasses(obj)
                    break;
            
                default:
                    console.info('Nothing to add!')
                    break;
            }

            return _me
        }

        remove(obj){
            let _me = this

            switch (obj.name) {
                case 'hammer':
                    _me.scene1.cont.scene.removeChild(_me.scene1.cont.scene.getChildByName('hammer_pack'))
                    _me.boxs['hammer_pack'] = undefined
                    break;

                case 'glasses':
                    console.log('Remove glasses')
                    _me.scene1.cont.scene.removeChild(_me.scene1.cont.scene.getChildByName('glasses_pack'))
                    _me.boxs['glasses_pack'] = undefined
                    break;
            
                default:
                    console.info('Nothing to remove!')
                    break;
            }

            return _me
        }

        activeItem(obj){
            let _me = this

            if(obj.active){
                // cancel current active element's focus
                let act = _me.boxs[_me.active_item]

                if(_me.active_item.length != 0 && act){
                    createjs.Tween.get(act.ele)
                        .to({scale: 1}, 300, createjs.Ease.getBackOut(3))
                        .call(()=>{
                            act.active = false
                            _me.active_item = ''
                        })
                }

                createjs.Tween.get(_me.boxs[obj.name].ele)
                    .to({scale: 1.3}, 300, createjs.Ease.getBackOut(3))
                    .call(()=>{
                        _me.boxs[obj.name].active = true
                        _me.active_item = obj.name
                    })

                console.log(_me.active_item)
            }else{
                createjs.Tween.get(_me.boxs[obj.name].ele)
                    .to({scale: 1}, 300, createjs.Ease.getBackOut(3))
                    .call(()=>{
                        _me.boxs[obj.name].active = false
                        _me.active_item = ''
                    })
            }

            return _me
        }

        addHammer(obj){
            let _me = this,
                hammer_pack,
                cont = new createjs.Container()

            cont.x = 2333
            cont.y = 175

            hammer_pack = new createjs.Bitmap(obj.img)
            hammer_pack.name = 'hammer_pack'
            hammer_pack.x = -1 * hammer_pack.getBounds().width / 2
            hammer_pack.y = -1 * hammer_pack.getBounds().height / 2
            hammer_pack.on('click', (e)=>{
                createjs.Sound.play('sound_click')
                console.log('use')
                if(!_me.boxs['hammer_pack'].active){
                    _me.activeItem({
                        name: 'hammer_pack',
                        active: true
                    })
                }else{
                    _me.activeItem({
                        name: 'hammer_pack',
                        active: false
                    })
                }
            })

            cont.addChild(hammer_pack)

            _me.scene1.cont.scene.addChild(cont)

            obj.cb && obj.cb()

            _me.boxs['hammer_pack'] = {
                active: false,
                ele: cont
            }

            return _me
        }

        addGlasses(obj){
            let _me = this,
                glasses_pack,
                cont = new createjs.Container()

            cont.x = 2333
            cont.y = 504
            cont.name = 'glasses_pack'

            glasses_pack = new createjs.Bitmap(obj.img)
            // glasses_pack.name = 'glasses_pack'
            glasses_pack.x = -1 * glasses_pack.getBounds().width / 2
            glasses_pack.y = -1 * glasses_pack.getBounds().height / 2
            glasses_pack.on('click', (e)=>{
                createjs.Sound.play('sound_click')
                console.log('use')
                if(!_me.boxs['glasses_pack'].active){
                    _me.activeItem({
                        name: 'glasses_pack',
                        active: true
                    })
                }else{
                    _me.activeItem({
                        name: 'glasses_pack',
                        active: false
                    })
                }
            })

            cont.addChild(glasses_pack)

            _me.scene1.cont.scene.addChild(cont)

            obj.cb && obj.cb()

            _me.boxs['glasses_pack'] = {
                active: false,
                ele: cont
            }

            return _me
        }
    }

    createjs.RotationPlugin.install()

    let scene1 = (new Scene1()).init(),
        BACKPACK = new Backpack({
            scene1: scene1
        })

    /**
     * Preload 
     */
    let queue = new createjs.LoadQueue()
    queue.installPlugin(createjs.Sound)
    queue.on('complete', handleComplete, this)
    queue.on('progress', handleProgress, this)
    // queue.loadFile({id:"sound", src:"http://path/to/sound.mp3"});
    queue.loadManifest(manifest)

    function handleComplete(e) {
        createjs.Sound.play('sound_bg', {
            loop: -1
        })
        scene1.addBg(queue.getResult('scene1_bg'))
        scene1.addGlasses(queue.getResult('scene1_glasses'))
        scene1.addMural(queue.getResult('scene1_mural'))
        scene1.addBell(queue.getResult('scene1_bell'))
        scene1.addCabinet(queue.getResult('scene1_cabinet'))
        scene1.addDrawer(queue.getResult('scene1_drawer'))
        scene1.addHammer(queue.getResult('scene1_hammer'), queue.getResult('scene1_hammer_pack'))
        scene1.addEnvelope(queue.getResult('scene1_piece1'), queue.getResult('scene1_envelope_open'))
        
        scene1.addGrandpa(queue.getResult('scene1_grandpa'), queue.getResult('scene1_grandpa_glass'))

        scene1.render()
        // document.body.appendChild(image);
    }
    function handleError(e){
        console.error(e)
    }
    function handleProgress(e) {
        console.log(e.progress)
    }
    
}(jQuery, window))