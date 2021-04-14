#include <stdio.h>
#include <conio.h>
int max = 5;
int queue[5];
int front = -1, rear = -1;
void insert_in_queue(int x)
{
    if (rear == max - 1)
    {
        printf("Overflow\n");
    }
    else if (front == -1 && rear == -1)
    {
        front = 0;
        rear = 0;
        queue[rear] = x;
    }
    else
    {
        rear++;
        queue[rear] = x;
    }
}
int remove_from_queue()
{
    int val;
    if (front == rear + 1)
    {
        printf("Underflow\n");
        return -1;
    }
    else
    {
        val = queue[front];
        front++;
        return val;
    }
}
void display()
{
    if (front == -1 && rear == -1)
        printf("Underflow\n");
    else
    {
        int i = front;
        while (i <= rear)
            printf("%d\t", queue[i++]);
        printf("\n");
    }
}
int main()
{
    int x, op = 0, val;
    while (op != 4)
    {
        printf("1.Insert\n2.Remove\n3.Display\n4.Exit\n");
        printf("Enter the number of operation:");
        scanf("%d", &op);
        if (op == 1)
        {
            printf("Enter the value to be inserted:");
            scanf("%d", &val);
            insert_in_queue(val);
        }
        else if (op == 2)
        {
            printf("%d\n", remove_from_queue());
        }
        else if (op == 3)
            display();
        else
        {
            break;
        }
    }

    return 0;
}