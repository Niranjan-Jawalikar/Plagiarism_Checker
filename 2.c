#include <stdio.h>
#include <conio.h>
#include <stdlib.h>
#include <ctype.h>

struct node
{
    int data;
    struct node *next;
};
struct node *start = NULL;

void insert_beg(int val)
{
    struct node *ptr = start;
    struct node *pre_start = start;
    start = (struct node *)malloc(sizeof(struct node));
    start->data = val;
    if (ptr == NULL)
        start->next = start;
    else
    {
        start->next = ptr;
        while (ptr->next != pre_start)
            ptr = ptr->next;
        ptr->next = start;
    }
    printf("Inserted successfully\n");
}
void insert_end(int val)
{
    struct node *new_node = (struct node *)malloc(sizeof(struct node));
    struct node *ptr = start;
    while (ptr->next != start)
        ptr = ptr->next;
    new_node->data = val;
    new_node->next = start;
    ptr->next = new_node;
    printf("Inserted successfully\n");
}
void delete_circular(int val)
{
    struct node *ptr = start;
    struct node *pre_start = start;
    struct node *pre_ptr;
    if (start == NULL)
        printf("List empty\n");
    else if (start->data == val)
    {
        if (start->next != start)
        {
            while (ptr->next != start)
                ptr = ptr->next;
            ptr->next = start->next;
            start = start->next;
            free(pre_start);
        }
        else
        {
            start = NULL;
            free(start);
        }
        printf("Deleted successfully\n");
    }
    else
    {
        while (ptr->data != val)
        {
            pre_ptr = ptr;
            ptr = ptr->next;
            if (ptr == start)
                break;
        }
        if (ptr == start)
            printf("Value Not Found\n");
        else
        {
            pre_ptr->next = ptr->next;
            free(ptr);
            printf("Deleted successfully\n");
        }
    }
}
void display()
{
    struct node *ptr = start;
    while (ptr)
    {
        printf("%d\t", ptr->data);
        ptr = ptr->next;
        if (ptr == start)
        {
            printf("\n");
            break;
        }
    }
    if (ptr == NULL)
        printf("List empty\n");
}

int main()
{
    int choice = 0, val;
    while (choice != 5)
    {
        printf("1.Inset Beginning\n2.Insert end\n3.Delete\n4.Display\n5.Exit\nEnter the option number:\n");
        scanf("%d", &choice);
        if (choice == 1)
        {
            printf("Enter the value to be inserted:\n");
            scanf("%d", &val);
            insert_beg(val);
        }
        else if (choice == 2)
        {

            printf("Enter the value to be inserted:\n");
            scanf("%d", &val);
            insert_end(val);
        }
        else if (choice == 3)
        {
            printf("Enter the value to be deleted:\n");
            scanf("%d", &val);
            delete_circular(val);
        }
        else if (choice == 4)
            display();
        else if (choice == 5)
            break;
        else
            printf("Invalid Input\n");
    }
    return 0;
}
