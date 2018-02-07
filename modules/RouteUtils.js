import React from 'react'

function isValidChild(object) {
  return object == null || React.isValidElement(object)
}

export function isReactChildren(object) {
  return isValidChild(object) || (Array.isArray(object) && object.every(isValidChild))
}

function createRoute(defaultProps, props) {
  return { ...defaultProps, ...props }
}

export function createRouteFromReactElement(element) {
  const type = element.type
  const route = createRoute(type.defaultProps, element.props)

  if (route.children) {
    // 递归子路由
    const childRoutes = createRoutesFromReactChildren(route.children, route)

    if (childRoutes.length)
      route.childRoutes = childRoutes

    delete route.children
  }

  return route
}

/**
 * Creates and returns a routes object from the given ReactChildren. JSX
 * provides a convenient way to visualize how routes in the hierarchy are
 * nested.
 *
 *   import { Route, createRoutesFromReactChildren } from 'react-router'
 *
 *   const routes = createRoutesFromReactChildren(
 *     <Route component={App}>
 *       <Route path="home" component={Dashboard}/>
 *       <Route path="news" component={NewsFeed}/>
 *     </Route>
 *   )
 *
 * Note: This method is automatically used when you provide <Route> children
 * to a <Router> component.
 */
export function createRoutesFromReactChildren(children, parentRoute) {
  const routes = []

  React.Children.forEach(children, function (element) {
    if (React.isValidElement(element)) {
      // Component classes may have a static create* method.
      // 一些路由组件有 createRouteFromReactElement 静态方法，如：IndexRedirect
      if (element.type.createRouteFromReactElement) {
        const route = element.type.createRouteFromReactElement(element, parentRoute)

        if (route)
          routes.push(route)
      } else {
        routes.push(createRouteFromReactElement(element))
      }
    }
  })

  return routes
}

/**
 * Creates and returns an array of routes from the given object which
 * may be a JSX route, a plain object route, or an array of either.
 */
export function createRoutes(routes) {
  // react-children
  if (isReactChildren(routes)) {
    routes = createRoutesFromReactChildren(routes)
  // routes 参数配置项
  } else if (routes && !Array.isArray(routes)) {
    routes = [ routes ]
  }

  return routes
}
