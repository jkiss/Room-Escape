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

    // circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50)
    // circle.x = 100
    // circle.y = 100
    // stage.addChild(circle)

    class Scene1{
        constructor(props){
            this.bg = null

            this.container = {
                scene: new createjs.Container(),
                mask: new createjs.Container()
            }
        }

        init(data){
            let _me = this

            stage.addChild(_me.container.scene)
            stage.addChild(_me.container.mask)

            return _me
        }

        addBg(img){
            let _me = this

            _me.bg = new createjs.Bitmap(img)
            // _me.bg.scale = stage_w / _me.bg.getBounds().width
            _me.bg.name = 'bg'

            _me.container.scene.addChild(this.bg)

            return _me
        }

        addCabinet(img){
            let _me = this,
                cabinet

            cabinet = new createjs.Bitmap(img)
            cabinet.name = 'cabinet'
            cabinet.x = 396
            cabinet.y = 1090
            cabinet.on('click', (e)=>{
                _me.showMask()
            })

            _me.container.scene.addChild(cabinet)

            return _me
        }

        showMask(){
            let _me = this,
                mask = new createjs.Shape()

            mask.graphics.beginFill('rgba(0,0,0,0.8)').drawRect(0, 0, stage_w, stage_h)
            mask.name = 'mask'
            mask.on('click', (e)=>{
                console.log('mask', mask.name)
                _me.container.mask.removeChild(_me.container.mask.getChildByName('mask'))
                stage.update()
            })
            _me.container.mask.addChild(mask)

            stage.update()
        }

        render(){
            stage.update()
        }
    }

    let scene1 = (new Scene1()).init()

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
        // createjs.Sound.play("sound");
        scene1.addBg(queue.getResult('scene1_bg'))
        scene1.addCabinet(queue.getResult('scene1_cabinet'))
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