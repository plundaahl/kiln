# Dependency Locator

The `DependencyLocator` is <ENGINE>'s dependency resolution mechanism. It's a slightly modified [Service Locator](http://gameprogrammingpatterns.com/service-locator.html). The name has been changed for clarity, as the "Service" layer in <ENGINE> is a specific thing, and the same dependency resolution mechanism is used at multiple layers.

Worth noting is that <ENGINE>'s `DependencyLocator` expects factory functions, not classes. Your dependency should be a class, the factory function should return an instance of it. This should allow you to construct and test the class without worrying about the `DependencyLocator`, using standard constructor parameters, and allow the factory function to handle the dependency resolution.
