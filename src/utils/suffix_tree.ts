/**
 * SuffixTree Algorithm
 *
 * @copyright Ben Langmead
 * @link https://nbviewer.jupyter.org/gist/BenLangmead/6665861
 * @link http://www.cs.jhu.edu/~langmea/resources/lecture_notes/suffix_trees.pdf
 */

class SuffixNode {
  label: string
  out: Record<string, SuffixNode>

  constructor (label: string) {
    this.label = label
    this.out = {}
  }
}

export class SuffixTree {
  root: SuffixNode

  constructor (s: string) {
    s += '$'

    this.root = new SuffixNode('')
    this.root.out[s[0]] = new SuffixNode(s)

    for (let i = 0; i < s.length; i++) {
      let cur = this.root
      let j = i

      while (j < s.length) {
        if (cur.out[s[j]]) {
          const child = cur.out[s[j]] as SuffixNode
          const label = child.label

          let k = j + 1

          while (k - j < label.length && s[k] === label[k - j]) {
            k++
          }

          if (k - j === label.length) {
            cur = child
            j = k
          } else {
            const cExist = label[k - j]
            const cNew = s[k]

            const mid = new SuffixNode(label.substr(0, k - j))
            mid.out[cNew] = new SuffixNode(s.substr(k))
            mid.out[cExist] = child

            child.label = label.substr(k - j)
            cur.out[s[j]] = mid
          }
        } else {
          cur.out[s[j]] = new SuffixNode(s.substr(j))
        }
      }
    }
  }

  followPath (s: string): [SuffixNode?, (number | SuffixNode)?] {
    let cur = this.root
    let i = 0

    while (i < s.length) {
      const c = s[i]
      if (!cur.out[c]) {
        return [undefined, undefined]
      }

      const child = cur.out[s[i]]
      const label = child.label

      let j = i + 1

      while (j - i < label.length && j < s.length && s[j] === label[j - i]) {
        j++
      }

      if (j - i === label.length) {
        cur = child
        i = j
      } else if (j === s.length) {
        return [child, j - i]
      } else {
        return [undefined, undefined]
      }
    }

    return [cur, undefined]
  }

  hasSubstring (s: string) {
    const [node, off] = this.followPath(s)

    return node !== undefined
  }

  hasSuffix (s: string) {
    const [node, off] = this.followPath(s)

    if (node === undefined) {
      return false
    }

    if (off === undefined) {
      return node.out['$']
    } else {
      return node.label[off as number] === '$'
    }
  }
}
