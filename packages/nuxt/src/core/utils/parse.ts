import { parseSync } from 'oxc-parser'
import type { CatchClause, ClassBody, Declaration, Expression, MethodDefinition, ModuleDeclaration, ObjectProperty, Pattern, PrivateIdentifier, Program, PropertyDefinition, SpreadElement, Statement, Super, SwitchCase, TemplateElement } from 'oxc-parser'
import { walk as _walk } from 'estree-walker'
import type { SyncHandler } from 'estree-walker'
import type { Node as ESTreeNode, Program as ESTreeProgram, ModuleSpecifier } from 'estree'

/** estree also has AssignmentProperty, Identifier and Literal as possible node types */
export type Node = Declaration | Expression | ClassBody | CatchClause | MethodDefinition | ModuleDeclaration | ModuleSpecifier | Pattern | PrivateIdentifier | Program | SpreadElement | Statement | Super | SwitchCase | TemplateElement | ObjectProperty | PropertyDefinition

type WalkerCallback = (this: ThisParameterType<SyncHandler>, node: Node, parent: Node | null, ctx: { key: string | number | symbol | null | undefined, index: number | null | undefined, ast: Program | Node }) => void

export function walk (ast: Program | Node, callback: { enter?: WalkerCallback, leave?: WalkerCallback }) {
  return _walk(ast as unknown as ESTreeProgram | ESTreeNode, {
    enter (node, parent, key, index) {
      callback.enter?.call(this, node as Node, parent as Node | null, { key, index, ast })
    },
    leave (node, parent, key, index) {
      callback.leave?.call(this, node as Node, parent as Node | null, { key, index, ast })
    },
  })
}

export function parseAndWalk (code: string, sourceFilename: string, callback: WalkerCallback): Program
export function parseAndWalk (code: string, sourceFilename: string, object: { enter?: WalkerCallback, leave?: WalkerCallback }): Program
export function parseAndWalk (code: string, sourceFilename: string, callback: { enter?: WalkerCallback, leave?: WalkerCallback } | WalkerCallback) {
  const ast = parseSync(code, { sourceType: 'module', sourceFilename }).program
  walk(ast, typeof callback === 'function' ? { enter: callback } : callback)
  return ast
}

type WithLocations<T> = T & { start: number, end: number }

export function withLocations<T> (node: T): WithLocations<T> {
  return node as WithLocations<T>
}
