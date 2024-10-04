// TODO: createElement 함수 구현
// 1. vNode가 falsy면 빈 텍스트 노드를 반환합니다.
// 2. vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환합니다.
// 3. vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가합니다.
// 4. vNode.type이 함수면 해당 함수를 호출하고 그 결과로 createElement를 재귀 호출합니다.
// 5. 위 경우가 아니면 실제 DOM 요소를 생성합니다:
//    - vNode.type에 해당하는 요소를 생성
//    - vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
//    - vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가

export function createElement(vNode) {
  // 여기에 구현하세요

  if (!vNode) {
    //vNode가 falsy면 빈 텍스트 노드를 반환
    return document.createTextNode("");
  } else if (typeof vNode === "number" || typeof vNode === "string") {
    //vNode가 문자열이나 숫자면 텍스트 노드를 생성하여 반환
    return document.createTextNode(vNode);
  }

  if (typeof vNode === "object" && Array.isArray(vNode)) {
    //vNode가 배열이면 DocumentFragment를 생성하고 각 자식에 대해 createElement를 재귀 호출하여 추가
    const $fragment = document.createDocumentFragment();
    vNode.forEach((cNode) => {
      $fragment.appendChild(createElement(cNode));
    });
    return $fragment;
  }

  if (typeof vNode.type === "function") {
    //vNode.type이 함수면 해당 함수를 호출하고 그 결과로 createElement를 재귀 호출
    return createElement(
      vNode.type({ ...vNode.props, children: vNode.children })
    );
  } else {
    const $el = document.createElement(vNode.type); //Node.type에 해당하는 요소를 생성
    if (vNode.props) {
      const props = Object.entries(vNode.props); //vNode.props의 속성들을 적용 (이벤트 리스너, className, 일반 속성 등 처리)
      props.forEach(([key, value]) => {
        //evnet binding
        if (key.startsWith("on") && typeof value === "function") {
          $el.addEventListener(
            key.substring(2, key.length).toLowerCase(),
            value
          );
        } else if (key === "className") {
          //className ->class
          $el.setAttribute("class", value);
        } else $el.setAttribute(key, value);
      });
    }
    if (vNode.children.length > 0) {
      const childrens = vNode.children; //vNode.children의 각 자식에 대해 createElement를 재귀 호출하여 추가
      childrens.forEach((child) => {
        return $el.appendChild(createElement(child));
      });
    }

    return $el;
  }
}
