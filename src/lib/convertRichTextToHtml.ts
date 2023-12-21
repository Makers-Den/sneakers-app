export type ShopifyRichText = {
  type: string;
  children: ShopifyRichText[];
  text?: string;
  value?: string;
  url?: string;
  title?: string;
  target?: string;
  level?: number;
  listType?: string;
  bold?: boolean;
  italic?: boolean;
};

export function convertRichTextToHtml(
  schema: string | ShopifyRichText | ShopifyRichText[],
  scoped = false
) {
  let richTextObject = schema as ShopifyRichText | ShopifyRichText[];
  if (typeof schema === "string") {
    richTextObject = JSON.parse(schema);
  }

  let html = ``;
  if (Array.isArray(richTextObject)) {
    for (const el of richTextObject) {
      switch (el.type) {
        case "paragraph":
          html += buildParagraph(el);
          break;
        case "heading":
          html += buildHeading(el);
          break;
        case "list":
          html += buildList(el);
          break;
        case "list-item":
          html += buildListItem(el);
          break;
        case "link":
          html += buildLink(el);
          break;
        case "text":
          html += buildText(el);
          break;
        default:
          break;
      }
    }
  } else if (
    richTextObject.type === "root" &&
    richTextObject.children.length > 0
  ) {
    if (scoped) {
      html += `
      <div class="${scoped === true ? `rte` : scoped}">
        ${convertRichTextToHtml(richTextObject.children)}
      </div>
      `;
    } else {
      html += convertRichTextToHtml(richTextObject.children);
    }
  }

  return html;
}

export function buildParagraph(el: ShopifyRichText) {
  if (el?.children) {
    return `<p>${convertRichTextToHtml(el?.children)}</p>`;
  }
}

export function buildHeading(el: ShopifyRichText) {
  if (el?.children) {
    return `<h${el?.level}>${convertRichTextToHtml(el?.children)}</h${
      el?.level
    }>`;
  }
}

export function buildList(el: ShopifyRichText) {
  if (el?.children) {
    if (el?.listType === "ordered") {
      return `<ol>${convertRichTextToHtml(el?.children)}</ol>`;
    } else {
      return `<ul>${convertRichTextToHtml(el?.children)}</ul>`;
    }
  }
}

export function buildListItem(el: ShopifyRichText) {
  if (el?.children) {
    return `<li>${convertRichTextToHtml(el?.children)}</li>`;
  }
}

export function buildLink(el: ShopifyRichText) {
  return `<a href="${el?.url}" title="${el?.title}" target="${
    el?.target
  }">${convertRichTextToHtml(el?.children)}</a>`;
}

export function buildText(el: ShopifyRichText) {
  if (el?.bold) {
    return `<strong>${el?.value}</strong>`;
  }
  if (el?.italic) {
    return `<em>${el?.value}</em>`;
  }
  return el?.value;
}
