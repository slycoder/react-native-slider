'use strict';var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key];}}}return target;};

var _react=require("react");var _react2=_interopRequireDefault(_react);




var _reactNative=require("react-native");function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj};}function _objectWithoutProperties(obj,keys){var target={};for(var i in obj){if(keys.indexOf(i)>=0)continue;if(!Object.prototype.hasOwnProperty.call(obj,i))continue;target[i]=obj[i];}return target;}







var shallowCompare=require('react-addons-shallow-compare'),
styleEqual=require('style-equal');

var TRACK_SIZE=4;
var THUMB_SIZE=20;

function Rect(x,y,width,height){
this.x=x;
this.y=y;
this.width=width;
this.height=height;
}

Rect.prototype.containsPoint=function(x,y){
return x>=this.x&&
y>=this.y&&
x<=this.x+this.width&&
y<=this.y+this.height;
};

var DEFAULT_ANIMATION_CONFIGS={
spring:{
friction:7,
tension:100},

timing:{
duration:150,
easing:_reactNative.Easing.inOut(_reactNative.Easing.ease),
delay:0}};







var Slider=_react2.default.createClass({displayName:"Slider",
propTypes:{








value:_react.PropTypes.number,





disabled:_react.PropTypes.bool,




minimumValue:_react.PropTypes.number,




maximumValue:_react.PropTypes.number,





step:_react.PropTypes.number,





minimumTrackTintColor:_react.PropTypes.string,





maximumTrackTintColor:_react.PropTypes.string,




thumbTintColor:_react.PropTypes.string,








thumbTouchSize:_react.PropTypes.shape(
{width:_react.PropTypes.number,height:_react.PropTypes.number}),





onValueChange:_react.PropTypes.func,





onSlidingStart:_react.PropTypes.func,





onSlidingComplete:_react.PropTypes.func,




style:_reactNative.View.propTypes.style,




trackStyle:_reactNative.View.propTypes.style,




thumbStyle:_reactNative.View.propTypes.style,




debugTouchArea:_react.PropTypes.bool,




animateTransitions:_react.PropTypes.bool,




animationType:_react.PropTypes.oneOf(['spring','timing']),




animationConfig:_react.PropTypes.object},

getInitialState:function getInitialState(){
return{
containerSize:{width:0,height:0},
trackSize:{width:0,height:0},
thumbSize:{width:0,height:0},
allMeasured:false,
value:new _reactNative.Animated.Value(this.props.value)};

},
getDefaultProps:function getDefaultProps(){
return{
value:0,
minimumValue:0,
maximumValue:1,
step:0,
minimumTrackTintColor:'#3f3f3f',
maximumTrackTintColor:'#b3b3b3',
thumbTintColor:'#343434',
thumbTouchSize:{width:40,height:40},
debugTouchArea:false,
animationType:'timing'};

},
componentWillMount:function componentWillMount(){
this._panResponder=_reactNative.PanResponder.create({
onStartShouldSetPanResponder:this._handleStartShouldSetPanResponder,
onMoveShouldSetPanResponder:this._handleMoveShouldSetPanResponder,
onPanResponderGrant:this._handlePanResponderGrant,
onPanResponderMove:this._handlePanResponderMove,
onPanResponderRelease:this._handlePanResponderEnd,
onPanResponderTerminationRequest:this._handlePanResponderRequestEnd,
onPanResponderTerminate:this._handlePanResponderEnd});

},
componentWillReceiveProps:function componentWillReceiveProps(nextProps){
var newValue=nextProps.value;

if(this.props.value!==newValue){
if(this.props.animateTransitions){
this._setCurrentValueAnimated(newValue);
}else
{
this._setCurrentValue(newValue);
}
}
},
shouldComponentUpdate:function shouldComponentUpdate(nextProps,nextState){





return shallowCompare(
{props:this._getPropsForComponentUpdate(this.props),state:this.state},
this._getPropsForComponentUpdate(nextProps),
nextState)||
!styleEqual(this.props.style,nextProps.style)||
!styleEqual(this.props.trackStyle,nextProps.trackStyle)||
!styleEqual(this.props.thumbStyle,nextProps.thumbStyle);
},
render:function render(){var _props=












this.props,minimumValue=_props.minimumValue,maximumValue=_props.maximumValue,minimumTrackTintColor=_props.minimumTrackTintColor,maximumTrackTintColor=_props.maximumTrackTintColor,thumbTintColor=_props.thumbTintColor,styles=_props.styles,style=_props.style,trackStyle=_props.trackStyle,thumbStyle=_props.thumbStyle,debugTouchArea=_props.debugTouchArea,other=_objectWithoutProperties(_props,["minimumValue","maximumValue","minimumTrackTintColor","maximumTrackTintColor","thumbTintColor","styles","style","trackStyle","thumbStyle","debugTouchArea"]);var _state=
this.state,value=_state.value,containerSize=_state.containerSize,trackSize=_state.trackSize,thumbSize=_state.thumbSize,allMeasured=_state.allMeasured;
var mainStyles=styles||defaultStyles;
var thumbLeft=value.interpolate({
inputRange:[minimumValue,maximumValue],
outputRange:[0,containerSize.width-thumbSize.width]});


var valueVisibleStyle={};
if(!allMeasured){
valueVisibleStyle.opacity=0;
}

var minimumTrackStyle=_extends({
position:'absolute',
width:_reactNative.Animated.add(thumbLeft,thumbSize.width/2),
backgroundColor:minimumTrackTintColor},
valueVisibleStyle);


var touchOverflowStyle=this._getTouchOverflowStyle();

return(
_react2.default.createElement(_reactNative.View,_extends({},other,{style:[mainStyles.container,style],onLayout:this._measureContainer}),
_react2.default.createElement(_reactNative.View,{
style:[{backgroundColor:maximumTrackTintColor},mainStyles.track,trackStyle],
renderToHardwareTextureAndroid:true,
onLayout:this._measureTrack}),
_react2.default.createElement(_reactNative.Animated.View,{
renderToHardwareTextureAndroid:true,
style:[mainStyles.track,trackStyle,minimumTrackStyle]}),
_react2.default.createElement(_reactNative.Animated.View,{
onLayout:this._measureThumb,
renderToHardwareTextureAndroid:true,
style:[
{backgroundColor:thumbTintColor},
mainStyles.thumb,thumbStyle,_extends({

transform:[
{translateX:thumbLeft},
{translateY:-(-trackSize.height+thumbSize.height)/2}]},

valueVisibleStyle)]}),



_react2.default.createElement(_reactNative.View,_extends({
renderToHardwareTextureAndroid:true,
style:[defaultStyles.touchArea,touchOverflowStyle]},
this._panResponder.panHandlers),
debugTouchArea===true&&this._renderDebugThumbTouchRect(thumbLeft))));



},

_getPropsForComponentUpdate:function _getPropsForComponentUpdate(props){var

value=







props.value,onValueChange=props.onValueChange,onSlidingStart=props.onSlidingStart,onSlidingComplete=props.onSlidingComplete,style=props.style,trackStyle=props.trackStyle,thumbStyle=props.thumbStyle,otherProps=_objectWithoutProperties(props,["value","onValueChange","onSlidingStart","onSlidingComplete","style","trackStyle","thumbStyle"]);

return otherProps;
},

_handleStartShouldSetPanResponder:function _handleStartShouldSetPanResponder(e){

return this._thumbHitTest(e);
},

_handleMoveShouldSetPanResponder:function _handleMoveShouldSetPanResponder(){

return false;
},

_handlePanResponderGrant:function _handlePanResponderGrant(){
this._previousLeft=this._getThumbLeft(this._getCurrentValue());
this._fireChangeEvent('onSlidingStart');
},
_handlePanResponderMove:function _handlePanResponderMove(e,gestureState){
if(this.props.disabled){
return;
}

this._setCurrentValue(this._getValue(gestureState));
this._fireChangeEvent('onValueChange');
},
_handlePanResponderRequestEnd:function _handlePanResponderRequestEnd(e,gestureState){

return false;
},
_handlePanResponderEnd:function _handlePanResponderEnd(e,gestureState){
if(this.props.disabled){
return;
}

this._setCurrentValue(this._getValue(gestureState));
this._fireChangeEvent('onSlidingComplete');
},

_measureContainer:function _measureContainer(x){
this._handleMeasure('containerSize',x);
},

_measureTrack:function _measureTrack(x){
this._handleMeasure('trackSize',x);
},

_measureThumb:function _measureThumb(x){
this._handleMeasure('thumbSize',x);
},

_handleMeasure:function _handleMeasure(name,x){var _x$nativeEvent$layout=
x.nativeEvent.layout,width=_x$nativeEvent$layout.width,height=_x$nativeEvent$layout.height;
var size={width:width,height:height};

var storeName="_"+name;
var currentSize=this[storeName];
if(currentSize&&width===currentSize.width&&height===currentSize.height){
return;
}
this[storeName]=size;

if(this._containerSize&&this._trackSize&&this._thumbSize){
this.setState({
containerSize:this._containerSize,
trackSize:this._trackSize,
thumbSize:this._thumbSize,
allMeasured:true});

}
},

_getRatio:function _getRatio(value){
return(value-this.props.minimumValue)/(this.props.maximumValue-this.props.minimumValue);
},

_getThumbLeft:function _getThumbLeft(value){
var ratio=this._getRatio(value);
return ratio*(this.state.containerSize.width-this.state.thumbSize.width);
},

_getValue:function _getValue(gestureState){
var length=this.state.containerSize.width-this.state.thumbSize.width;
var thumbLeft=this._previousLeft+gestureState.dx;

var ratio=thumbLeft/length;

if(this.props.step){
return Math.max(this.props.minimumValue,
Math.min(this.props.maximumValue,
this.props.minimumValue+Math.round(ratio*(this.props.maximumValue-this.props.minimumValue)/this.props.step)*this.props.step));


}else{
return Math.max(this.props.minimumValue,
Math.min(this.props.maximumValue,
ratio*(this.props.maximumValue-this.props.minimumValue)+this.props.minimumValue));


}
},

_getCurrentValue:function _getCurrentValue(){
return this.state.value.__getValue();
},

_setCurrentValue:function _setCurrentValue(value){
this.state.value.setValue(value);
},

_setCurrentValueAnimated:function _setCurrentValueAnimated(value){
var animationType=this.props.animationType;
var animationConfig=_extends(
{},
DEFAULT_ANIMATION_CONFIGS[animationType],
this.props.animationConfig,
{toValue:value});


_reactNative.Animated[animationType](this.state.value,animationConfig).start();
},

_fireChangeEvent:function _fireChangeEvent(event){
if(this.props[event]){
this.props[event](this._getCurrentValue());
}
},

_getTouchOverflowSize:function _getTouchOverflowSize(){
var state=this.state;
var props=this.props;

var size={};
if(state.allMeasured===true){
size.width=Math.max(0,props.thumbTouchSize.width-state.thumbSize.width);
size.height=Math.max(0,props.thumbTouchSize.height-state.containerSize.height);
}

return size;
},

_getTouchOverflowStyle:function _getTouchOverflowStyle(){var _getTouchOverflowSize2=
this._getTouchOverflowSize(),width=_getTouchOverflowSize2.width,height=_getTouchOverflowSize2.height;

var touchOverflowStyle={};
if(width!==undefined&&height!==undefined){
var verticalMargin=-height/2;
touchOverflowStyle.marginTop=verticalMargin;
touchOverflowStyle.marginBottom=verticalMargin;

var horizontalMargin=-width/2;
touchOverflowStyle.marginLeft=horizontalMargin;
touchOverflowStyle.marginRight=horizontalMargin;
}

if(this.props.debugTouchArea===true){
touchOverflowStyle.backgroundColor='orange';
touchOverflowStyle.opacity=0.5;
}

return touchOverflowStyle;
},

_thumbHitTest:function _thumbHitTest(e){
var nativeEvent=e.nativeEvent;
var thumbTouchRect=this._getThumbTouchRect();
return thumbTouchRect.containsPoint(nativeEvent.locationX,nativeEvent.locationY);
},

_getThumbTouchRect:function _getThumbTouchRect(){
var state=this.state;
var props=this.props;
var touchOverflowSize=this._getTouchOverflowSize();

return new Rect(
touchOverflowSize.width/2+this._getThumbLeft(this._getCurrentValue())+(state.thumbSize.width-props.thumbTouchSize.width)/2,
touchOverflowSize.height/2+(state.containerSize.height-props.thumbTouchSize.height)/2,
props.thumbTouchSize.width,
props.thumbTouchSize.height);

},

_renderDebugThumbTouchRect:function _renderDebugThumbTouchRect(thumbLeft){
var thumbTouchRect=this._getThumbTouchRect();
var positionStyle={
left:thumbLeft,
top:thumbTouchRect.y,
width:thumbTouchRect.width,
height:thumbTouchRect.height};


return(
_react2.default.createElement(_reactNative.Animated.View,{
style:[defaultStyles.debugThumbTouchArea,positionStyle],
pointerEvents:"none"}));


}});



var defaultStyles=_reactNative.StyleSheet.create({
container:{
height:40,
justifyContent:'center'},

track:{
height:TRACK_SIZE,
borderRadius:TRACK_SIZE/2},

thumb:{
position:'absolute',
width:THUMB_SIZE,
height:THUMB_SIZE,
borderRadius:THUMB_SIZE/2},

touchArea:{
position:'absolute',
backgroundColor:'transparent',
top:0,
left:0,
right:0,
bottom:0},

debugThumbTouchArea:{
position:'absolute',
backgroundColor:'green',
opacity:0.5}});



module.exports=Slider;