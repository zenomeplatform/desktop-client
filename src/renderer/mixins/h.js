/* eslint no-param-reassign:0 */
import React from 'react';
import _ from 'lodash';


const classIdSplit = /([\.#]?[a-zA-Z0-9_:-]+)/;
const notClassId = /^\.|#/;

export function h(tagName, properties, children = []) {
  /**
  Wrapper for React.createElement() to simplify usage and remove boilerplate

  Usage:

      h('div', [h('h2', 'Hello')]);
      h('div#foo.bar.baz', [h('h2', 'Hello')]);
      h('div.bar.baz', [h('h2', 'Hello')]);
      h('div', {className: 'greeting'}, [h('h2', 'Hello')]);
  **/
    let tag, props;

    if (_.isEmpty(children) && (
            typeof properties === 'string' ||
            _.isArray(properties) ||
            React.isValidElement(properties)
        )) {
        children = properties;
        props = {};
    }

    props = props || properties || {};

    if (typeof tagName === 'string') {
        tag = parseTag(tagName, props);
    } else if (typeof tagName === 'undefined') {
        throw new Error('tagName argument cannot be undefined.');
    } else {
        tag = tagName;
    }

    if (!_.isArray(children)) {
        children = [children];
    }

    return React.createElement(tag, props, ...children);
}

function parseTag(tag, props) {
    if (!tag) {
        return 'div';
    }

    const noId = !(props.hasOwnProperty('id'));

    const tagParts = tag.split(classIdSplit);
    let tagName = null;

    if (notClassId.test(tagParts[1])) {
        tagName = 'div';
    }

    let classes, part, type;

    tagParts.forEach(tagPart => {
        part = tagPart;

        if (!part) {
            return;
        }

        type = part.charAt(0);

        if (!tagName) {
            tagName = part;
        } else if (type === '.') {
            classes = classes || [];
            classes.push(part.substring(1, part.length));
        } else if (type === '#' && noId) {
            props.id = part.substring(1, part.length);
        }
    });

    if (classes) {
        if (props.className) {
            classes.push(props.className);
        }

        props.className = classes.join(' ');
    }

    return props.namespace ? tagName : tagName.toLowerCase();
}

export {React, _};
