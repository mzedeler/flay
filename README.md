# flay - filesystem layout linter

Usage:

In the root of your JavaScript project:

```
  yarn add -D git://github.com/mzedeler/flay
  yarn flay .
```

This will then lint your filesystem according to the following rules:

# Compound directories must contain an index file
Ok:
```
  MyFancyComponent
    +-- index.ts
    +-- MyFancyComponent.tsx
    +-- MyFancyComponent.test.tsx
```

Not ok:
```
  MyFancyComponent
    +-- MyFancyComponent.tsx
    +-- MyFancyComponent.test.tsx
```

# Collection directories must not contain an index file

Ok:
```
  components
    +-- MyFancyComponent.tsx
    +-- MyOtherFancyComponent.tsx
```

Not qk:
```
  components
    +-- index.ts
    +-- MyFancyComponent.tsx
    +-- MyOtherFancyComponent.tsx
```

# Definitions
Currently, compound directories are defined as any directory with a capital letter in the name.

Any non-compound directory is classified as a collection.

# Ignore file
It is possible to skip validation of a directory by adding it to `.flayignore`, but this only works if
you add the exact path of every directory you want to ignore:

To ignore foo/bar here:
```
  foo
    +-- bar
```

Put `foo/bar` in a top level `.flayignore` file or but `bar` in a `.flayignore` file in `foo`.
