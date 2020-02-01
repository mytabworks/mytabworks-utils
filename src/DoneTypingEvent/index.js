
const DoneTypingEvent = (callback, ms = 700, withKeyboardCB) => {
    let timeoutReference;

    const typingEventHandlerForChildren = (event) => {
      
      const { type, keyCode, target, which} = event
      const isInputBlurOrPressEnter = (type === 'blur' || (target.nodeName !== 'TEXTAREA' && (keyCode === 13 || which === 13)))
      const typeIsKeyUpUnlessItIsBackspace = type === 'keyup' && keyCode !== 8
      const FakeEvent = { type, target, keyCode }
      typeof withKeyboardCB === 'function' && type !== 'blur' && withKeyboardCB(event)

      if(timeoutReference && isInputBlurOrPressEnter)
      {
        clearTimeout(timeoutReference);

        timeoutReference = undefined
        return callback(FakeEvent);
      }

      if(typeIsKeyUpUnlessItIsBackspace) return;

      if (timeoutReference) clearTimeout(timeoutReference);

      timeoutReference = setTimeout(() => { callback(FakeEvent); timeoutReference = undefined }, ms);
    }
    
    return {
        onBlur: typingEventHandlerForChildren,
        onKeyUp: typingEventHandlerForChildren,
        onKeyPress: typingEventHandlerForChildren,
    }
}

export default DoneTypingEvent