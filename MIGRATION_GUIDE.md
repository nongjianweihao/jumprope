# Repository API Migration Guide

This guide helps you update code that uses the repository APIs to take advantage of the new methods and improvements.

## Overview of Changes

The repository layer has been enhanced with:
1. **Better documentation** - All methods now have JSDoc comments
2. **Alias methods** - More intuitive method names
3. **Helper methods** - Additional functionality for common operations
4. **Improved error handling** - Better error messages for invalid operations

## Breaking Changes

**None!** All existing code will continue to work. The new methods are additions and aliases.

## Recommended Updates

### Using Clearer Method Names

#### Before:
```typescript
const template = await templatesRepo.upsert(newTemplate);
const found = await templatesRepo.get(id);
const all = await templatesRepo.list();
await templatesRepo.remove(id);
```

#### After (Recommended):
```typescript
const template = await templatesRepo.save(newTemplate);
const found = await templatesRepo.findById(id);
const all = await templatesRepo.getAll();
await templatesRepo.delete(id);
```

### Adding Students to Classes

#### Before:
```typescript
const classEntity = await classesRepo.get(classId);
if (classEntity && !classEntity.studentIds.includes(studentId)) {
  classEntity.studentIds.push(studentId);
  await classesRepo.upsert(classEntity);
}
```

#### After (Recommended):
```typescript
await classesRepo.addStudent(classId, studentId);
```

### Removing Students from Classes

#### Before:
```typescript
const classEntity = await classesRepo.get(classId);
if (classEntity) {
  classEntity.studentIds = classEntity.studentIds.filter(id => id !== studentId);
  await classesRepo.upsert(classEntity);
}
```

#### After (Recommended):
```typescript
await classesRepo.removeStudent(classId, studentId);
```

### Updating Student Points

#### Before:
```typescript
const student = await studentsRepo.get(studentId);
if (student) {
  student.pointsTotal = (student.pointsTotal ?? 0) + points;
  await studentsRepo.upsert(student);
}
```

#### After (Recommended):
```typescript
const newTotal = await studentsRepo.addPoints(studentId, points);
```

### Adding Badges to Students

#### Before:
```typescript
const student = await studentsRepo.get(studentId);
if (student) {
  const badges = student.badges ?? [];
  if (!badges.includes(badgeName)) {
    badges.push(badgeName);
    student.badges = badges;
    await studentsRepo.upsert(student);
  }
}
```

#### After (Recommended):
```typescript
await studentsRepo.addBadge(studentId, badgeName);
```

### Closing Sessions

#### Before:
```typescript
const session = await sessionsRepo.get(sessionId);
if (session) {
  session.closed = true;
  await sessionsRepo.upsert(session);
}
```

#### After (Recommended):
```typescript
await sessionsRepo.closeSession(sessionId);
```

### Getting Latest Test for Student

#### Before:
```typescript
const tests = await testsRepo.listByStudent(studentId);
const latestTest = tests.length > 0 ? tests[tests.length - 1] : undefined;
```

#### After (Recommended):
```typescript
const latestTest = await testsRepo.getLatestByStudent(studentId);
```

### Filtering Data

#### Before:
```typescript
const allTemplates = await templatesRepo.list();
const specTemplates = allTemplates.filter(t => t.period === 'SPEC');
```

#### After (Recommended):
```typescript
const specTemplates = await templatesRepo.listByPeriod('SPEC');
```

#### Before:
```typescript
const allStudents = await studentsRepo.list();
const rank2Students = allStudents.filter(s => s.currentRank === 2);
```

#### After (Recommended):
```typescript
const rank2Students = await studentsRepo.listByRank(2);
```

### Checking Existence

#### Before:
```typescript
const student = await studentsRepo.get(studentId);
if (student) {
  // Student exists
}
```

#### After (Recommended):
```typescript
if (await studentsRepo.exists(studentId)) {
  // Student exists
}
```

### Getting Counts

#### Before:
```typescript
const allStudents = await studentsRepo.list();
const count = allStudents.length;
```

#### After (Recommended):
```typescript
const count = await studentsRepo.count();
```

### Filtering Payments by Date Range

#### Before:
```typescript
const allPayments = await billingRepo.listAllPayments();
const filtered = allPayments.filter(p => 
  p.paidAt >= startDate && p.paidAt <= endDate
);
const revenue = filtered.reduce((sum, p) => sum + p.amount, 0);
```

#### After (Recommended):
```typescript
const revenue = await billingRepo.revenueByDateRange(startDate, endDate);
```

## Error Handling Improvements

Some methods now throw more descriptive errors. Always use try-catch for operations that can fail:

```typescript
try {
  await classesRepo.addStudent('invalid-class-id', studentId);
} catch (error) {
  // Error message will be: "Class with ID invalid-class-id not found"
  console.error(error.message);
  // Handle the error appropriately
}
```

Methods that throw errors:
- `classesRepo.addStudent()`
- `classesRepo.removeStudent()`
- `studentsRepo.addPoints()`
- `studentsRepo.addBadge()`

## TypeScript Benefits

All methods now have comprehensive JSDoc comments, so your IDE will provide:
- **Better autocomplete** - See all available methods
- **Inline documentation** - Read what each method does without leaving your editor
- **Parameter hints** - Understand what each parameter means
- **Return type information** - Know what data you'll get back

## Performance Tips

1. **Use specific queries**: Methods like `listByPeriod()`, `listByRank()`, `listByQuarter()` are more efficient than filtering in memory.

2. **Use exists() for checks**: Instead of fetching the full entity just to check if it exists, use the `exists()` method.

3. **Use count methods**: Get counts without loading all records into memory.

4. **Batch operations**: When possible, perform multiple operations in a sequence rather than one-by-one.

## Example: Complete Refactoring

### Before:
```typescript
async function processSession(sessionId: string, studentId: string) {
  // Get session
  const session = await sessionsRepo.get(sessionId);
  if (!session) return;
  
  // Close session
  session.closed = true;
  await sessionsRepo.upsert(session);
  
  // Get student
  const student = await studentsRepo.get(studentId);
  if (!student) return;
  
  // Add points
  student.pointsTotal = (student.pointsTotal ?? 0) + 10;
  
  // Add badge
  const badges = student.badges ?? [];
  if (!badges.includes('attendance-streak')) {
    badges.push('attendance-streak');
    student.badges = badges;
  }
  
  // Update rank
  if (student.pointsTotal >= 100) {
    student.currentRank = 2;
  }
  
  await studentsRepo.upsert(student);
  
  // Get latest test
  const tests = await testsRepo.listByStudent(studentId);
  const latestTest = tests[tests.length - 1];
  
  return { session, student, latestTest };
}
```

### After (Recommended):
```typescript
async function processSession(sessionId: string, studentId: string) {
  // Close session
  await sessionsRepo.closeSession(sessionId);
  
  // Add points and badge
  const newPoints = await studentsRepo.addPoints(studentId, 10);
  await studentsRepo.addBadge(studentId, 'attendance-streak');
  
  // Update rank if needed
  if (newPoints >= 100) {
    await studentsRepo.updateRank(studentId, 2);
  }
  
  // Get latest test
  const latestTest = await testsRepo.getLatestByStudent(studentId);
  
  // Get updated data
  const session = await sessionsRepo.findById(sessionId);
  const student = await studentsRepo.findById(studentId);
  
  return { session, student, latestTest };
}
```

## Benefits of Refactoring

1. **More readable** - Intent is clearer with descriptive method names
2. **Less code** - Helper methods reduce boilerplate
3. **Safer** - Better error handling and validation
4. **Faster** - More efficient queries
5. **Maintainable** - Less duplication, easier to update

## Questions?

If you encounter issues or have questions about the new API, please:
1. Check the [Repository README](src/store/repositories/README.md) for detailed documentation
2. Look at the JSDoc comments in your IDE
3. Review the test files for usage examples
4. Open an issue on GitHub

## Next Steps

1. Update your code gradually - no rush, the old API still works
2. Start with new code - use the new methods in new features
3. Refactor gradually - update old code when you're working on it anyway
4. Enjoy the benefits - cleaner, more maintainable code!
